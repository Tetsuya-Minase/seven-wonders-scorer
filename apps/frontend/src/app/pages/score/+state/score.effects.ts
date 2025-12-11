import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, OnInitEffects } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { WebSocketService } from '../../../services/websocket.service';
import { ScoreApiActions } from './score.actions';

/**
 * Score Effects
 * Handles side effects for score state management
 */
@Injectable()
export class ScoreEffects implements OnInitEffects {
  private readonly actions$ = inject(Actions);
  private readonly webSocketService = inject(WebSocketService);

  /**
   * Listen to WebSocket room data and sync to store
   * Replaces the subscription in ScoreService constructor
   */
  readonly syncFromWebSocket$ = createEffect(() =>
    this.webSocketService.getRoomData().pipe(
      filter((roomData) => !!roomData?.scores),
      map((roomData) =>
        ScoreApiActions.roomDataReceived({ scores: roomData.scores })
      )
    )
  );

  /**
   * Called when effects are initialized
   */
  ngrxOnInitEffects(): Action {
    // Return a no-op action or use this for initialization logic if needed
    return { type: '[Score Effects] Init' };
  }
}
