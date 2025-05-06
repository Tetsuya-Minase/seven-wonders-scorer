import { Injectable, signal } from '@angular/core';
import { SignalState, ReadonlyState } from '../../../types/signal-state';
import { WebSocketService } from '../../../services/websocket.service';
import { ScoreState } from './score.state';

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

  constructor(private readonly webSocketService: WebSocketService) {
    // WebSocketからのルームデータを監視
    this.webSocketService.getRoomData().subscribe((roomData) => {
      if (roomData) {
        this.#roomState.set(roomData);
      }
    });

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
   * スコアデータをScoreState配列に変換
   */
  public getScores(): ScoreState[] {
    const roomData = this.#roomState();
    if (!roomData || !roomData.scores) {
      return [];
    }

    return Object.values(roomData.scores).map((score) => {
      const scienceSet = Math.min(
        score.scienceScore.compass,
        score.scienceScore.gear,
        score.scienceScore.tablet,
      );
      const scienceScoreSum =
        scienceSet * 7 +
        (score.scienceScore.gear > 0
          ? score.scienceScore.gear * score.scienceScore.gear
          : 0) +
        (score.scienceScore.compass > 0
          ? score.scienceScore.compass * score.scienceScore.compass
          : 0) +
        (score.scienceScore.tablet > 0
          ? score.scienceScore.tablet * score.scienceScore.tablet
          : 0);
      const scoreSum = Object.values(score).reduce(
        (sum: number, value): number => {
          if (value == null) {
            return sum;
          }
          if (typeof value === 'number') {
            return sum + value;
          }
          if (
            typeof value === 'object' &&
            'gear' in value &&
            'compass' in value &&
            'tablet' in value
          ) {
            return sum + scienceScoreSum;
          }
          return sum;
        },
        0,
      );

      return {
        ...score,
        scienceScore: {
          ...score.scienceScore,
          sum: scienceScoreSum,
        },
        sum: scoreSum,
      };
    });
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
