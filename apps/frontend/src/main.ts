import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { scoreFeature } from './app/pages/score/+state/score.feature';
import { ScoreEffects } from './app/pages/score/+state/score.effects';
import { isDevMode } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    // NgRx Store
    provideStore({
      [scoreFeature.name]: scoreFeature.reducer,
    }),
    // NgRx Effects
    provideEffects([ScoreEffects]),
    // NgRx DevTools (development only)
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    }),
  ],
}).catch((err) => console.error(err));
