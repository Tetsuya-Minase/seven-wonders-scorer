import { Injectable } from '@angular/core';
import { WebSocketService } from '../../../services/websocket.service';
import { RoomState } from '../state/room.state';

/**
 * ルーム操作サービス
 * WebSocketを使用してルームの操作を行う
 */
@Injectable({
  providedIn: 'root'
})
export class RoomService {
  readonly #state;

  constructor(
    private readonly roomState: RoomState,
    private readonly webSocketService: WebSocketService,
  ) {
    this.#state = roomState.asReadonly();
  }

  /**
   * ルームに参加する
   * @param roomName ルーム名
   * @param username ユーザー名
   * @returns ルーム参加結果のObservable
   */
  public joinRoom(roomName: string, username: string) {
    return this.webSocketService.joinRoom(roomName, username);
  }

  /**
   * ユーザーを追加する
   * @param username ユーザー名
   */
  public addUser(username: string): void {
    this.roomState.addUser(username);
  }

  /**
   * スコアを更新する
   * @param username ユーザー名
   * @param score 更新するスコア
   */
  public updateScore(username: string, score: any): void {
    this.roomState.updateScore(username, score);
  }
}
