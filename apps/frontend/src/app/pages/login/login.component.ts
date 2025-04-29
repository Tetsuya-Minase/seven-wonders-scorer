import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WebSocketService } from '../../services/websocket.service';
import { Subscription } from 'rxjs';

/**
 * ログイン画面コンポーネント
 * ルーム名とユーザー名を入力してログインする
 */
@Component({
  selector: 'seven-wonders-scorer-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent implements OnDestroy {
  /**
   * ログインフォーム
   */
  public loginForm: FormGroup;
  
  /**
   * フォームが送信されたかどうか
   */
  public formSubmitted = false;
  
  /**
   * ログイン処理中かどうか
   */
  public isLoading = false;
  
  /**
   * エラーメッセージ
   */
  public errorMessage = '';
  
  /**
   * サブスクリプション
   */
  private subscription: Subscription | null = null;

  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly webSocketService: WebSocketService,
  ) {
    this.loginForm = this.formBuilder.group({
      roomName: ['', Validators.required],
      username: ['', Validators.required],
    });
    
    // WebSocket接続を開始
    this.webSocketService.connect();
  }
  
  /**
   * コンポーネント破棄時の処理
   */
  ngOnDestroy(): void {
    // サブスクリプションを解除
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * ログイン処理
   */
  public login(): void {
    this.formSubmitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      return;
    }

    const roomName = this.loginForm.get('roomName')?.value;
    const username = this.loginForm.get('username')?.value;
    
    this.isLoading = true;
    
    // WebSocketを使用してルームに参加
    this.subscription = this.webSocketService.joinRoom(roomName, username).subscribe({
      next: (response) => {
        if (response.error) {
          this.errorMessage = response.error;
          this.isLoading = false;
          return;
        }
        
        // ローカルストレージにルーム名とユーザー名を保存
        localStorage.setItem('roomName', roomName);
        localStorage.setItem('username', username);
        
        // トップページに遷移
        this.router.navigate(['/seven-wonders-scorer/game']);
      },
      error: (error) => {
        console.error('ルーム参加エラー:', error);
        this.errorMessage = 'サーバーに接続できませんでした。後でもう一度お試しください。';
        this.isLoading = false;
      }
    });
  }

  /**
   * ルーム名の入力エラーを確認
   */
  public get isRoomNameInvalid(): boolean {
    const control = this.loginForm.get('roomName');
    return control ? control.invalid && this.formSubmitted : false;
  }

  /**
   * ユーザー名の入力エラーを確認
   */
  public get isUsernameInvalid(): boolean {
    const control = this.loginForm.get('username');
    return control ? control.invalid && this.formSubmitted : false;
  }
}
