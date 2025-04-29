import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WebSocketService } from '../../services/websocket.service';

/**
 * ログイン画面のモジュール
 */
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        loadComponent: () => import('./login.component').then(m => m.LoginComponent),
      },
    ]),
  ],
  providers: [WebSocketService],
})
export class LoginModule {}
