import { Component } from '@angular/core';
import { ScoreService } from './services/score.service';
import { UserService } from './services/user.service';
import { NonNullableFormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'seven-wonders-scorer-top',
    templateUrl: 'top.component.html',
    standalone: false
})
export class TopComponent {
  public showModal = false;
  public username = '';
  public userForm = this.formBuilder.group({
    username: ['', Validators.required]
  });
  public formSubmitted = false;

  constructor(
    private readonly scoreService: ScoreService,
    private readonly userService: UserService,
    private readonly formBuilder: NonNullableFormBuilder
  ) {
    // 初期ユーザー追加コードを削除
  }

  public addUser(): void {
    // フォーム送信フラグをtrueに設定
    this.formSubmitted = true;
    
    if (this.userForm.invalid) {
      return;
    }
    
    const username = this.userForm.get('username')?.value;
    if (username) {
      this.userService.addUser(username);
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
    return this.scoreService.getScore();
  }
  
  // エラー状態を確認するゲッター
  public get isUsernameInvalid(): boolean {
    const control = this.userForm.get('username');
    return control ? (control.invalid && this.formSubmitted) : false;
  }
}
