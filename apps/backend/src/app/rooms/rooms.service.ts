import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { WsException } from '@nestjs/websockets';

/**
 * ルームの内部状態を表すデータモデル
 */
export interface RoomData {
  /** ルームの一意な識別子 */
  readonly id: string;
  /** ルーム名 */
  readonly name: string;
  /** ルームに所属するユーザーのリスト */
  readonly users: ReadonlyArray<{
    /** ユーザーID */
    readonly id: string;
    /** ユーザー名 */
    readonly username: string;
    /** クライアントのSocket ID */
    readonly clientId: string;
  }>;
  /** ユーザーごとのスコアマップ */
  readonly scores: Readonly<Record<string, any>>;
  /** 最終アクティビティのタイムスタンプ（ミリ秒） */
  readonly lastActivityAt: number;
}

/**
 * ルーム管理サービス
 */
@Injectable()
export class RoomsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RoomsService.name);
  private readonly rooms: Map<string, RoomData> = new Map();
  private readonly clientRoomMap: Map<string, string> = new Map();
  /** アイドルルームをクリーンアップするためのインターバルタイマー */
  private cleanupInterval: NodeJS.Timeout | null = null;

  /** 最大ルーム数 */
  private readonly MAX_ROOMS = 100;
  
  /** 1ルームあたりの最大ユーザー数 */
  private readonly MAX_USERS_PER_ROOM = 8;
  
  /** ルームがアイドル状態とみなされるまでのTTL（ミリ秒） */
  private readonly ROOM_IDLE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

  /**
   * ルームの有効期限切れ（TTL超過）時に呼び出されるコールバック
   */
  public onRoomExpired?: (roomId: string) => void;

  /**
   * モジュール初期化時の処理。定期的なクリーンアップ処理を開始する。
   */
  onModuleInit() {
    // Check for idle rooms every hour
    this.cleanupInterval = setInterval(() => {
      this.cleanupIdleRooms();
    }, 60 * 60 * 1000);
  }

  /**
   * モジュール破棄時の処理。インターバルタイマーを解除する。
   */
  onModuleDestroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }

  /**
   * アイドル状態（TTL超過）のルームを定期的に掃除する
   */
  private cleanupIdleRooms() {
    const now = Date.now();
    for (const [roomId, room] of this.rooms.entries()) {
      if (now - room.lastActivityAt > this.ROOM_IDLE_TTL_MS) {
        this.logger.log(`Deleting idle room ${room.name} (${roomId})`);
        
        // Remove mappings for users in this room
        for (const user of room.users) {
          this.clientRoomMap.delete(user.clientId);
        }
        
        this.rooms.delete(roomId);
        
        if (this.onRoomExpired) {
          this.onRoomExpired(roomId);
        }
      }
    }
  }

  /**
   * ルームに参加する
   * @param clientId クライアントID
   * @param roomName ルーム名
   * @param username ユーザー名
   * @returns ルームID
   */
  joinRoom(clientId: string, roomName: string, username: string): string {
    const roomId = this.getRoomIdByName(roomName);
    
    if (!this.rooms.has(roomId)) {
      if (this.rooms.size >= this.MAX_ROOMS) {
        throw new WsException('Room limit reached');
      }
      this.createRoom(roomId, roomName);
    }
    
    this.addUserToRoomWithClientId(roomId, username, clientId);
    this.clientRoomMap.set(clientId, roomId);
    this.updateActivity(roomId);
    
    this.logger.log(`User ${username} joined room ${roomName} (${roomId})`);
    return roomId;
  }

  /**
   * ルームから退出する
   * @param clientId クライアントID
   * @returns 退出したルームID
   */
  leaveRoom(clientId: string): string | null {
    const roomId = this.clientRoomMap.get(clientId);
    if (!roomId) return null;
    
    const room = this.rooms.get(roomId);
    if (room) {
      const updatedUsers = room.users.filter(user => user.clientId !== clientId);
      const updatedRoom: RoomData = {
        ...room,
        users: updatedUsers,
        lastActivityAt: Date.now(),
      };
      
      this.rooms.set(roomId, updatedRoom);
      if (updatedUsers.length === 0) {
        this.rooms.delete(roomId);
        this.logger.log(`Room ${room.name} (${roomId}) deleted because it's empty`);
      }
    }
    
    this.clientRoomMap.delete(clientId);
    return roomId;
  }

  /**
   * ルームにユーザーを追加する
   * @param roomId ルームID
   * @param username ユーザー名
   * @returns 追加されたユーザーID
   */
  addUserToRoom(roomId: string, username: string): string | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;
    
    const existingUser = room.users.find(user => user.username === username);
    if (existingUser) return existingUser.id;
    
    if (room.users.length >= this.MAX_USERS_PER_ROOM) {
      throw new WsException('User limit per room reached');
    }
    
    const userId = uuidv4();
    const newUser = {
      id: userId,
      username,
      clientId: '',
    };
    const updatedUsers = [...room.users, newUser];
    
    const updatedScores = {
      ...room.scores,
      [username]: this.getInitialScore(username),
    };
    
    const updatedRoom: RoomData = {
      ...room,
      users: updatedUsers,
      scores: updatedScores,
      lastActivityAt: Date.now(),
    };
    
    this.rooms.set(roomId, updatedRoom);
    this.logger.log(`User ${username} added to room ${room.name} (${roomId})`);
    
    return userId;
  }

  /**
   * ルームにユーザーをクライアントIDと共に追加する
   * @param roomId ルームID
   * @param username ユーザー名
   * @param clientId クライアントID
   * @returns 追加されたユーザーID
   */
  private addUserToRoomWithClientId(roomId: string, username: string, clientId: string): string {
    const room = this.rooms.get(roomId);
    if (!room) throw new Error(`Room ${roomId} not found`);
    
    // 同じユーザー名が既に存在するか確認
    const existingUser = room.users.find(user => user.username === username);
    if (existingUser) {
      // 既存ユーザーのクライアントIDを更新（イミュータブルに新しい配列を作成）
      const updatedUsers = room.users.map(user => 
        user.username === username ? { ...user, clientId } : user
      );
      this.rooms.set(roomId, { ...room, users: updatedUsers, lastActivityAt: Date.now() });
      return existingUser.id;
    }
    
    if (room.users.length >= this.MAX_USERS_PER_ROOM) {
      throw new WsException('User limit per room reached');
    }
    
    // 新しいユーザーを作成
    const userId = uuidv4();
    const newUser = { id: userId, username, clientId };
    const updatedUsers = [...room.users, newUser];
    
    // スコアの初期化
    const updatedScores = { ...room.scores };
    if (!updatedScores[username]) {
      updatedScores[username] = this.getInitialScore(username);
    }
    
    // 新しいルームデータを作成
    this.rooms.set(roomId, {
      ...room,
      users: updatedUsers,
      scores: updatedScores,
      lastActivityAt: Date.now(),
    });
    
    return userId;
  }

  /**
   * 新規ユーザーの初期スコアデータを生成する
   * @param username ユーザー名
   * @returns 初期化されたスコアオブジェクト
   */
  private getInitialScore(username: string) {
    return {
      username,
      civilScore: 0,
      militaryScore: 0,
      scienceScore: { gear: 0, compass: 0, tablet: 0 },
      commercialScore: 0,
      guildScore: 0,
      cityScore: 0,
      leaderScore: 0,
      coinScore: 0,
      wonderScore: 0,
    };
  }

  /**
   * ルームを作成する
   * @param roomId ルームID
   * @param roomName ルーム名
   * @returns 作成されたルームデータ
   */
  private createRoom(roomId: string, roomName: string): RoomData {
    const newRoom: RoomData = {
      id: roomId,
      name: roomName,
      users: [],
      scores: {},
      lastActivityAt: Date.now(),
    };
    this.rooms.set(roomId, newRoom);
    this.logger.log(`Room ${roomName} (${roomId}) created`);
    return newRoom;
  }

  /**
   * ルーム名からルームIDを生成する
   * @param roomName ルーム名
   * @returns ルームID
   */
  private getRoomIdByName(roomName: string): string {
    // 単純化のため、ルーム名をそのままIDとして使用
    return roomName;
  }

  /**
   * クライアントIDからルームIDを取得する
   * @param clientId クライアントID
   * @returns ルームID
   */
  getRoomIdByClientId(clientId: string): string | undefined {
    return this.clientRoomMap.get(clientId);
  }

  /**
   * ルームデータを取得する
   * @param roomId ルームID
   * @returns ルームデータ
   */
  getRoomData(roomId: string): RoomData | undefined {
    return this.rooms.get(roomId);
  }

  /**
   * スコアを更新する
   * @param roomId ルームID
   * @param username ユーザー名
   * @param score 更新するスコア
   * @returns 更新されたスコア
   */
  updateScore(roomId: string, username: string, score: any): any | null {
    const room = this.rooms.get(roomId);
    if (!room || !room.scores[username]) return null;
    
    // スコアを更新（イミュータブルに新しいオブジェクトを作成）
    const updatedScores = {
      ...room.scores,
      [username]: {
        ...room.scores[username],
        ...score,
      },
    };
    
    // 新しいルームデータを作成
    this.rooms.set(roomId, {
      ...room,
      scores: updatedScores,
      lastActivityAt: Date.now(),
    });
    
    return updatedScores[username];
  }

  /**
   * ルームの最終アクティビティ日時を更新する
   * @param roomId ルームID
   */
  private updateActivity(roomId: string) {
    const room = this.rooms.get(roomId);
    if (room) {
      this.rooms.set(roomId, { ...room, lastActivityAt: Date.now() });
    }
  }

  /**
   * 全てのルームデータを取得する
   * @returns ルームデータの配列
   */
  getAllRooms(): ReadonlyArray<RoomData> {
    return Array.from(this.rooms.values());
  }
}

