import { createFeature } from '@ngrx/store';
import { scoreReducer } from './score.reducer';
import { SCORE_FEATURE_KEY } from './score.selectors';

/**
 * Score feature registration
 * Uses NgRx createFeature() for simplified setup
 */
export const scoreFeature = createFeature({
  name: SCORE_FEATURE_KEY,
  reducer: scoreReducer,
});

/**
 * Re-export auto-generated selectors from createFeature
 */
export const { selectScoresState: selectScoresFeatureState, selectScores } =
  scoreFeature;
