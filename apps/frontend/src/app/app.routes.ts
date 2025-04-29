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
          import('./pages/score/top.component.module').then((m) => m.TopModule),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'seven-wonders-scorer',
  },
];
