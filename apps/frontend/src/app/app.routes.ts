import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'score',
    loadComponent: () =>
      import('./pages/score/score.component').then((m) => m.ScoreComponent),
  },
  {
    path: '**',
    redirectTo: 'score',
  },
];
