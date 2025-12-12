import { Component, OnInit, OnDestroy, afterNextRender } from '@angular/core';
import { Router } from '@angular/router';
import { NonNullableFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { WebSocketService } from '../../services/websocket.service';
import { Subscription } from 'rxjs';
import { RoomService } from './services/room.service';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from './components/user-card/user-card.component';
import { ScoreUpdateModalComponent } from './components/score-update-modal/score-update-modal.component';
import { RoomState } from './state/room.state';
import { ScoreService } from './services/score.service';

@Component({
  selector: 'seven-wonders-scorer-score',
  templateUrl: 'score.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UserCardComponent, ScoreUpdateModalComponent],
})
export class ScoreComponent implements OnInit, OnDestroy {
  public showModal = false;
  public username = '';
  public userForm = this.formBuilder.group({
    username: ['', Validators.required],
  });
  public formSubmitted = false;
  public roomName = '';
  public currentUsername = '';
  
  private subscription: Subscription | null = null;

  constructor(
    private readonly roomService: RoomService,
    private readonly scoreService: ScoreService,
    private readonly roomState: RoomState,
    private readonly formBuilder: NonNullableFormBuilder,
    private readonly webSocketService: WebSocketService,
    private readonly router: Router,
  ) {
    // 変更検知サイクル完了後にルームに参加
    afterNextRender(() => {
      this.roomState.initialize();
    });
  }
  
  ngOnInit(): void {
    // ローカルストレージからルーム名とユーザー名を取得
    const roomName = localStorage.getItem('roomName');
    const username = localStorage.getItem('username');
    if (!roomName || !username) {
      console.error('ルーム名またはユーザー名が見つかりません');
      // ルーム名またはユーザー名がない場合はログイン画面にリダイレクト
      this.router.navigate(['/login']);
      return;
    }
    
    this.roomName = roomName;
    this.currentUsername = username;
    
    // WebSocket接続を開始
    this.webSocketService.connect();
    
    // 接続状態を監視
    this.subscription = this.webSocketService.getConnectionStatus().subscribe(connected => {
      if (connected) {
        console.log('WebSocket接続成功');
      } else {
        console.log('WebSocket切断');
      }
    });
  }
  
  ngOnDestroy(): void {
    // WebSocket接続を切断
    this.webSocketService.disconnect();
    
    // サブスクリプションを解除
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public addUser(): void {
    // フォーム送信フラグをtrueに設定
    this.formSubmitted = true;

    if (this.userForm.invalid) {
      return;
    }

    const username = this.userForm.get('username')?.value;
    if (username) {
      this.roomService.addUser(username);
      // フォームをリセットし、送信フラグをfalseに戻す
      this.userForm.reset();
      this.formSubmitted = false;
    }
  }

  public openModal(username: string) {
    this.showModal = true;
    this.username = username;
  }

  public closeModal() {
    this.showModal = false;
    this.username = '';
  }

  /**
   * スコアデータを取得（RoomStateのcomputedシグナルを使用）
   * computedシグナルにより、同じ参照が返されるためNG0100エラーが解消される
   */
  public get scores() {
    return this.scoreService.getScore();
  }
  
  public logout(): void {
    // ローカルストレージからルーム名とユーザー名を削除
    localStorage.removeItem('roomName');
    localStorage.removeItem('username');
    
    // WebSocket接続を切断
    this.webSocketService.disconnect();
    
    // ログイン画面にリダイレクト
    this.router.navigate(['/login']);
  }

  // エラー状態を確認するゲッター
  public get isUsernameInvalid(): boolean {
    const control = this.userForm.get('username');
    return control ? control.invalid && this.formSubmitted : false;
  }
}
