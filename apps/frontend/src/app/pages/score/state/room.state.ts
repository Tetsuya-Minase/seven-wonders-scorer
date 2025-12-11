import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SignalState, ReadonlyState } from '../../../types/signal-state';
import { WebSocketService } from '../../../services/websocket.service';

/**
 * ルーム状態の型定義
 */
export interface RoomStateType {
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
 * ルーム状態を管理するクラス
 */
@Injectable({
  providedIn: 'root'
})
export class RoomState implements SignalState<RoomStateType | null> {
  /**
   * ルーム状態
   */
  #roomState = signal<RoomStateType | null>(null);
  #initialized = false;
  readonly #platformId = inject(PLATFORM_ID);

  constructor(private readonly webSocketService: WebSocketService) {
    // WebSocketからのルームデータを監視
    // setTimeoutを使用して変更検知サイクル外で更新
    this.webSocketService.getRoomData().subscribe((roomData) => {
      if (roomData) {
        setTimeout(() => {
          this.#roomState.set(roomData);
        }, 0);
      }
    });
  }

  /**
   * ルームに参加（初回のみ実行）
   * コンポーネントのngOnInit等から呼び出す
   */
  public initialize(): void {
    if (this.#initialized || !isPlatformBrowser(this.#platformId)) {
      return;
    }
    this.#initialized = true;

    // ローカルストレージからルーム名とユーザー名を取得
    const roomName = localStorage.getItem('roomName');
    const username = localStorage.getItem('username');

    // ルーム名とユーザー名が存在する場合、ルームに参加
    if (roomName && username) {
      this.webSocketService.joinRoom(roomName, username).subscribe({
        next: (response) => {
          if (response.error) {
            console.error('ルーム参加エラー:', response.error);
            return;
          }
          console.log('ルーム参加成功:', response);
        },
        error: (error) => {
          console.error('ルーム参加エラー:', error);
        }
      });
    }
  }

  /**
   * ルーム状態を読み取り専用で取得
   */
  public asReadonly(): ReadonlyState<RoomStateType | null> {
    return this.#roomState.asReadonly() as ReadonlyState<RoomStateType | null>;
  }

  /**
   * ユーザーをルームに追加
   * @param username ユーザー名
   */
  public addUser(username: string): void {
    this.webSocketService.addUser(username).subscribe({
      next: (response) => {
        if (response.error) {
          console.error('ユーザー追加エラー:', response.error);
          return;
        }
        console.log('ユーザー追加成功:', response);
      },
      error: (error) => {
        console.error('ユーザー追加エラー:', error);
      }
    });
  }

  /**
   * スコアを更新
   * @param username ユーザー名
   * @param score 更新するスコア
   */
  public updateScore(username: string, score: any): void {
    this.webSocketService.updateScore(username, score).subscribe({
      next: (response) => {
        if (response.error) {
          console.error('スコア更新エラー:', response.error);
          return;
        }
        console.log('スコア更新成功:', response);
      },
      error: (error) => {
        console.error('スコア更新エラー:', error);
      }
    });
  }
}
