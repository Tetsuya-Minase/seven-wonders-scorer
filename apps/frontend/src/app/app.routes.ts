import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.component.module').then((m) => m.LoginModule),
  },
  {
    path: 'score',
    loadChildren: () =>
      import('./pages/score/score.component.module').then((m) => m.ScoreModule),
  },
  {
    path: '**',
    redirectTo: 'score',
  },
];
