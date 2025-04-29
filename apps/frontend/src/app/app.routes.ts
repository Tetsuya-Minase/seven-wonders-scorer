import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/top/top.component.module').then((m) => m.TopModule),
  },
];
