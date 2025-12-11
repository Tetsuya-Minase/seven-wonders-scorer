import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ScoreState } from '../state/score-state';
import { UpdateScore } from '../services/score.service';

/**
 * Score Actions
 * Maps to ScoreStateManager and ScoreService methods
 */
export const ScoreActions = createActionGroup({
  source: 'Score',
  events: {
    // User management (from ScoreStateManager)
    'Add User': props<{ username: string }>(),
    'Remove User': props<{ username: string }>(),

    // Individual score updates (from ScoreStateManager)
    'Update Civil Score': props<{ username: string; score: number }>(),
    'Update Military Score': props<{ username: string; score: number }>(),
    'Update Science Score': props<{
      username: string;
      score: { gear: number; compass: number; tablet: number };
    }>(),
    'Update Commercial Score': props<{ username: string; score: number }>(),
    'Update Guild Score': props<{ username: string; score: number }>(),
    'Update City Score': props<{ username: string; score: number }>(),
    'Update Leader Score': props<{ username: string; score: number }>(),
    'Update Coin Score': props<{ username: string; score: number }>(),
    'Update Wonder Score': props<{ username: string; score: number }>(),

    // Bulk update (from ScoreService.updateScore)
    'Update All Scores': props<{ username: string; scores: UpdateScore }>(),

    // WebSocket sync (from ScoreStateManager.syncFromRoomData)
    'Sync From Room Data': props<{ scores: Record<string, ScoreState> }>(),

    // Clear all scores
    'Clear All Scores': emptyProps(),
  },
});

/**
 * Score API Actions
 * Actions dispatched from Effects in response to external events
 */
export const ScoreApiActions = createActionGroup({
  source: 'Score API',
  events: {
    'Room Data Received': props<{ scores: Record<string, ScoreState> }>(),
  },
});
