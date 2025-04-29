import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { WebSocketService } from '../../services/websocket.service';
import { Subscription } from 'rxjs';
import { RoomService } from './services/room.service';

@Component({
  selector: 'seven-wonders-scorer-top',
  templateUrl: 'top.component.html',
  standalone: false,
})
export class TopComponent implements OnInit, OnDestroy {
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
    private readonly formBuilder: NonNullableFormBuilder,
    private readonly webSocketService: WebSocketService,
    private readonly router: Router,
  ) {}
  
  ngOnInit(): void {
    // ローカルストレージからルーム名とユーザー名を取得
    const roomName = localStorage.getItem('roomName');
    const username = localStorage.getItem('username');
    
    if (!roomName || !username) {
      // ルーム名またはユーザー名がない場合はログイン画面にリダイレクト
      this.router.navigate(['/seven-wonders-scorer']);
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

  public get scores() {
    const scores = this.roomService.getScores();
    
    // ScoreStateの型をScoreの型に変換
    return scores.map(score => {
      // scienceScoreの合計を計算
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
      
      // 全体の合計を計算
      const scoreSum = 
        score.civilScore +
        score.militaryScore +
        scienceScoreSum +
        score.commercialScore +
        score.guildScore +
        score.cityScore +
        score.leaderScore +
        score.coinScore +
        score.wonderScore;
      
      // Scoreの型に変換して返す
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
  
  public logout(): void {
    // ローカルストレージからルーム名とユーザー名を削除
    localStorage.removeItem('roomName');
    localStorage.removeItem('username');
    
    // WebSocket接続を切断
    this.webSocketService.disconnect();
    
    // ログイン画面にリダイレクト
    this.router.navigate(['/seven-wonders-scorer']);
  }

  // エラー状態を確認するゲッター
  public get isUsernameInvalid(): boolean {
    const control = this.userForm.get('username');
    return control ? control.invalid && this.formSubmitted : false;
  }
}
