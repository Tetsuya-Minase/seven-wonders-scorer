import { Route } from '@angular/router';
import { LoginComponent } from './login.component';

/**
 * ログイン画面のルート設定
 */
export const loginRoutes: Route[] = [
  {
    path: '',
    component: LoginComponent,
  },
];
