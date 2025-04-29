import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'seven-wonders-scorer',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/login/login.component.module').then((m) => m.LoginModule),
      },
      {
        path: 'game',
        loadChildren: () =>
          import('./pages/score/score.component.module').then((m) => m.ScoreModule),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'seven-wonders-scorer',
  },
];
