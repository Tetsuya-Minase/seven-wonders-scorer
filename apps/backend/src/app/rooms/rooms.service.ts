import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

/**
 * ルームデータの型定義
 */
export interface RoomData {
  readonly id: string;
  readonly name: string;
  readonly users: ReadonlyArray<{
    readonly id: string;
    readonly username: string;
    readonly clientId: string;
  }>;
  readonly scores: Readonly<Record<string, any>>;
}

/**
 * ルーム管理サービス
 */
@Injectable()
export class RoomsService {
  private readonly logger = new Logger(RoomsService.name);
  private readonly rooms: Map<string, RoomData> = new Map();
  private readonly clientRoomMap: Map<string, string> = new Map();

  /**
   * ルームに参加する
   * @param clientId クライアントID
   * @param roomName ルーム名
   * @param username ユーザー名
   * @returns ルームID
   */
  joinRoom(clientId: string, roomName: string, username: string): string {
    // ルーム名からルームIDを生成（同じルーム名なら同じIDになるようにする）
    const roomId = this.getRoomIdByName(roomName);
    
    // ルームが存在しない場合は作成
    if (!this.rooms.has(roomId)) {
      this.createRoom(roomId, roomName);
    }
    
    // ユーザーをルームに追加
    this.addUserToRoomWithClientId(roomId, username, clientId);
    
    // クライアントとルームの関連付けを保存
    this.clientRoomMap.set(clientId, roomId);
    
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
    
    if (!roomId) {
      return null;
    }
    
    const room = this.rooms.get(roomId);
    
    if (room) {
      // ルームからユーザーを削除（イミュータブルに新しい配列を作成）
      const updatedUsers = room.users.filter(user => user.clientId !== clientId);
      
      // 新しいルームデータを作成
      const updatedRoom: RoomData = {
        ...room,
        users: updatedUsers,
      };
      
      // ルームを更新
      this.rooms.set(roomId, updatedRoom);
      
      // ルームが空になった場合はルームを削除
      if (updatedUsers.length === 0) {
        this.rooms.delete(roomId);
        this.logger.log(`Room ${room.name} (${roomId}) deleted because it's empty`);
      }
    }
    
    // クライアントとルームの関連付けを削除
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
    
    if (!room) {
      return null;
    }
    
    // 同じユーザー名が既に存在するか確認
    const existingUser = room.users.find(user => user.username === username);
    if (existingUser) {
      return existingUser.id;
    }
    
    // 新しいユーザーを作成
    const userId = uuidv4();
    
    // スコアの初期化
    const updatedScores = {
      ...room.scores,
      [username]: {
        username,
        civilScore: 0,
        militaryScore: 0,
        scienceScore: {
          gear: 0,
          compass: 0,
          tablet: 0,
        },
        commercialScore: 0,
        guildScore: 0,
        cityScore: 0,
        leaderScore: 0,
        coinScore: 0,
        wonderScore: 0,
      },
    };
    
    // 新しいルームデータを作成
    const updatedRoom: RoomData = {
      ...room,
      scores: updatedScores,
    };
    
    // ルームを更新
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
    
    if (!room) {
      throw new Error(`Room ${roomId} not found`);
    }
    
    // 同じユーザー名が既に存在するか確認
    const existingUser = room.users.find(user => user.username === username);
    if (existingUser) {
      // 既存ユーザーのクライアントIDを更新（イミュータブルに新しい配列を作成）
      const updatedUsers = room.users.map(user => 
        user.username === username 
          ? { ...user, clientId } 
          : user
      );
      
      // 新しいルームデータを作成
      const updatedRoom: RoomData = {
        ...room,
        users: updatedUsers,
      };
      
      // ルームを更新
      this.rooms.set(roomId, updatedRoom);
      
      return existingUser.id;
    }
    
    // 新しいユーザーを作成
    const userId = uuidv4();
    const newUser = {
      id: userId,
      username,
      clientId,
    };
    
    // 新しいユーザー配列を作成
    const updatedUsers = [...room.users, newUser];
    
    // スコアの初期化
    const updatedScores = { ...room.scores };
    if (!updatedScores[username]) {
      updatedScores[username] = {
        username,
        civilScore: 0,
        militaryScore: 0,
        scienceScore: {
          gear: 0,
          compass: 0,
          tablet: 0,
        },
        commercialScore: 0,
        guildScore: 0,
        cityScore: 0,
        leaderScore: 0,
        coinScore: 0,
        wonderScore: 0,
      };
    }
    
    // 新しいルームデータを作成
    const updatedRoom: RoomData = {
      ...room,
      users: updatedUsers,
      scores: updatedScores,
    };
    
    // ルームを更新
    this.rooms.set(roomId, updatedRoom);
    
    return userId;
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
    
    if (!room || !room.scores[username]) {
      return null;
    }
    
    // スコアを更新（イミュータブルに新しいオブジェクトを作成）
    const updatedScores = {
      ...room.scores,
      [username]: {
        ...room.scores[username],
        ...score,
      },
    };
    
    // 新しいルームデータを作成
    const updatedRoom: RoomData = {
      ...room,
      scores: updatedScores,
    };
    
    // ルームを更新
    this.rooms.set(roomId, updatedRoom);
    
    return updatedScores[username];
  }

  /**
   * 全てのルームデータを取得する
   * @returns ルームデータの配列
   */
  getAllRooms(): ReadonlyArray<RoomData> {
    return Array.from(this.rooms.values());
  }
}
