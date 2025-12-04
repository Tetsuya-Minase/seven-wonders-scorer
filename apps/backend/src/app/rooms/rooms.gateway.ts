import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { RoomsService } from './rooms.service';

/**
 * WebSocketゲートウェイ - ルーム関連の通信を処理
 */
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoomsGateway {
  @WebSocketServer() server!: Server;
  private readonly logger = new Logger(RoomsGateway.name);

  constructor(private readonly roomsService: RoomsService) {}

  /**
   * クライアント接続時の処理
   * @param client 接続したクライアントのSocketインスタンス
   */
  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  /**
   * クライアント切断時の処理
   * @param client 切断したクライアントのSocketインスタンス
   */
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.roomsService.leaveRoom(client.id);
    
    // ユーザーが退出したルームの情報を更新
    const roomId = this.roomsService.getRoomIdByClientId(client.id);
    if (roomId) {
      const roomData = this.roomsService.getRoomData(roomId);
      if (roomData) {
        this.server.to(roomId).emit('roomData', roomData);
      }
    }
  }

  /**
   * ルーム参加イベントのハンドラー
   * @param client 接続しているクライアントのSocketインスタンス
   * @param payload ルーム参加に必要な情報（ルーム名、ユーザー名）
   * @returns 参加したルームの情報
   */
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomName: string; username: string },
  ) {
    const { roomName, username } = payload;
    
    // ルームに参加
    const roomId = this.roomsService.joinRoom(client.id, roomName, username);
    
    // Socketをルームに参加させる
    client.join(roomId);
    
    // ルームのデータを取得
    const roomData = this.roomsService.getRoomData(roomId);
    
    // ルーム内の全クライアントにルームデータを送信
    this.server.to(roomId).emit('roomData', roomData);
    
    return { roomId, roomData };
  }

  /**
   * スコア更新イベントのハンドラー
   * @param client 接続しているクライアントのSocketインスタンス
   * @param payload スコア更新情報
   */
  @SubscribeMessage('updateScore')
  handleUpdateScore(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { username: string; score: any },
  ) {
    const { username, score } = payload;
    
    // クライアントが参加しているルームIDを取得
    const roomId = this.roomsService.getRoomIdByClientId(client.id);
    
    if (!roomId) {
      return { error: 'ルームに参加していません' };
    }
    
    // ルーム内のスコアを更新
    this.roomsService.updateScore(roomId, username, score);
    
    // 更新されたルームデータを取得
    const roomData = this.roomsService.getRoomData(roomId);
    
    // ルーム内の全クライアントに更新されたデータを送信
    this.server.to(roomId).emit('roomData', roomData);
    
    return { success: true, roomData };
  }

  /**
   * ユーザー追加イベントのハンドラー
   * @param client 接続しているクライアントのSocketインスタンス
   * @param payload 追加するユーザー情報
   */
  @SubscribeMessage('addUser')
  handleAddUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { username: string },
  ) {
    const { username } = payload;
    
    // クライアントが参加しているルームIDを取得
    const roomId = this.roomsService.getRoomIdByClientId(client.id);
    
    if (!roomId) {
      return { error: 'ルームに参加していません' };
    }
    
    // ルームにユーザーを追加
    this.roomsService.addUserToRoom(roomId, username);
    
    // 更新されたルームデータを取得
    const roomData = this.roomsService.getRoomData(roomId);
    
    // ルーム内の全クライアントに更新されたデータを送信
    this.server.to(roomId).emit('roomData', roomData);
    
    return { success: true, roomData };
  }
}
