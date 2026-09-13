import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { joinRoomSchema, JoinRoomPayload } from './schemas/join-room.schema';
import { addUserSchema, AddUserPayload } from './schemas/add-user.schema';
import { updateScoreSchema, UpdateScorePayload } from './schemas/update-score.schema';
import { ZodValidationPipe } from './pipes/zod-validation.pipe';
import { WsValidationFilter } from './filters/ws-validation.filter';
import { RateLimitGuard } from './guards/rate-limit.guard';

/**
 * WebSocketゲートウェイ - ルーム関連の通信を処理
 */
@UseGuards(RateLimitGuard)
@UseFilters(new WsValidationFilter())
@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  },
  maxHttpBufferSize: 10 * 1024,
})
export class RoomsGateway {
  @WebSocketServer() server!: Server;
  private readonly logger = new Logger(RoomsGateway.name);

  /**
   * RoomsGateway を初期化します。
   * 
   * @param roomsService ルーム管理サービス
   */
  constructor(private readonly roomsService: RoomsService) {
    this.roomsService.onRoomExpired = (roomId: string) => {
      if (this.server) {
        this.server.to(roomId).emit('roomExpired');
        this.server.in(roomId).disconnectSockets();
      }
    };
  }

  /**
   * クライアント接続時の処理
   * 
   * @param client 接続したクライアントのSocketインスタンス
   */
  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  /**
   * クライアント切断時の処理
   * 
   * @param client 切断したクライアントのSocketインスタンス
   */
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.roomsService.leaveRoom(client.id);
    
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
   * 
   * @param client 接続しているクライアントのSocketインスタンス
   * @param payload ルーム参加に必要な情報（ルーム名、ユーザー名）
   * @returns 参加したルームの情報
   */
  @UsePipes(new ZodValidationPipe(joinRoomSchema))
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinRoomPayload,
  ) {
    const { roomName, username } = payload;
    
    const roomId = this.roomsService.joinRoom(client.id, roomName, username);
    client.join(roomId);
    const roomData = this.roomsService.getRoomData(roomId);
    this.server.to(roomId).emit('roomData', roomData);
    
    return { roomId, roomData };
  }

  /**
   * スコア更新イベントのハンドラー
   * 
   * @param client 接続しているクライアントのSocketインスタンス
   * @param payload スコア更新情報
   * @returns 更新の成功状態と最新のルームデータ、またはエラー情報
   */
  @UsePipes(new ZodValidationPipe(updateScoreSchema))
  @SubscribeMessage('updateScore')
  handleUpdateScore(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: UpdateScorePayload,
  ) {
    const { username, score } = payload;
    
    const roomId = this.roomsService.getRoomIdByClientId(client.id);
    if (!roomId) {
      return { error: 'ルームに参加していません' };
    }
    
    this.roomsService.updateScore(roomId, username, score);
    const roomData = this.roomsService.getRoomData(roomId);
    this.server.to(roomId).emit('roomData', roomData);
    
    return { success: true, roomData };
  }

  /**
   * ユーザー追加イベントのハンドラー
   * 
   * @param client 接続しているクライアントのSocketインスタンス
   * @param payload 追加するユーザー情報
   * @returns 更新の成功状態と最新のルームデータ、またはエラー情報
   */
  @UsePipes(new ZodValidationPipe(addUserSchema))
  @SubscribeMessage('addUser')
  handleAddUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: AddUserPayload,
  ) {
    const { username } = payload;
    
    const roomId = this.roomsService.getRoomIdByClientId(client.id);
    if (!roomId) {
      return { error: 'ルームに参加していません' };
    }
    
    this.roomsService.addUserToRoom(roomId, username);
    const roomData = this.roomsService.getRoomData(roomId);
    this.server.to(roomId).emit('roomData', roomData);
    
    return { success: true, roomData };
  }
}
