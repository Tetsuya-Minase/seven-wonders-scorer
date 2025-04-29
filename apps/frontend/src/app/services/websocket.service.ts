import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * WebSocketサービス
 * バックエンドとのWebSocket通信を管理する
 */
@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  /**
   * Socket.IOクライアントインスタンス
   */
  private readonly socket: Socket;
  
  /**
   * 接続状態
   */
  private readonly connectionStatus = new BehaviorSubject<boolean>(false);
  
  /**
   * ルームデータ
   */
  private readonly roomData = new BehaviorSubject<any>(null);

  constructor() {
    // Socket.IOクライアントの初期化
    this.socket = io(environment.apiUrl, {
      transports: ['websocket'],
      autoConnect: false,
    });
    
    // 接続イベントのリスナー
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.connectionStatus.next(true);
    });
    
    // 切断イベントのリスナー
    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.connectionStatus.next(false);
    });
    
    // ルームデータ更新イベントのリスナー
    this.socket.on('roomData', (data: any) => {
      console.log('Room data updated:', data);
      this.roomData.next(data);
    });
  }

  /**
   * WebSocket接続を開始する
   */
  public connect(): void {
    if (!this.socket.connected) {
      this.socket.connect();
    }
  }

  /**
   * WebSocket接続を切断する
   */
  public disconnect(): void {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }

  /**
   * ルームに参加する
   * @param roomName ルーム名
   * @param username ユーザー名
   * @returns ルーム参加結果のObservable
   */
  public joinRoom(roomName: string, username: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.emit('joinRoom', { roomName, username }, (response: any) => {
        observer.next(response);
        observer.complete();
      });
    });
  }

  /**
   * スコアを更新する
   * @param username ユーザー名
   * @param score 更新するスコア
   * @returns スコア更新結果のObservable
   */
  public updateScore(username: string, score: any): Observable<any> {
    return new Observable((observer) => {
      this.socket.emit('updateScore', { username, score }, (response: any) => {
        observer.next(response);
        observer.complete();
      });
    });
  }

  /**
   * ユーザーを追加する
   * @param username ユーザー名
   * @returns ユーザー追加結果のObservable
   */
  public addUser(username: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.emit('addUser', { username }, (response: any) => {
        observer.next(response);
        observer.complete();
      });
    });
  }

  /**
   * 接続状態のObservableを取得する
   * @returns 接続状態のObservable
   */
  public getConnectionStatus(): Observable<boolean> {
    return this.connectionStatus.asObservable();
  }

  /**
   * ルームデータのObservableを取得する
   * @returns ルームデータのObservable
   */
  public getRoomData(): Observable<any> {
    return this.roomData.asObservable();
  }
}
