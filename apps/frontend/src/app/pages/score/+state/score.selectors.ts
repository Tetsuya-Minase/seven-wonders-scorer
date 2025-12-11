import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ScoresState } from './score.reducer';
import { Score } from '../types/score';

/**
 * Feature key for the scores state slice
 */
export const SCORE_FEATURE_KEY = 'scores';

/**
 * Feature selector for scores state
 */
export const selectScoresState =
  createFeatureSelector<ScoresState>(SCORE_FEATURE_KEY);

/**
 * Select raw scores without computation
 */
export const selectRawScores = createSelector(
  selectScoresState,
  (state) => state.scores
);

/**
 * Select computed scores with sum calculations
 * Migrated from ScoreService.#calculateScores()
 */
export const selectComputedScores = createSelector(
  selectRawScores,
  (scores): Score[] =>
    scores.map((score) => {
      const { gear, compass, tablet } = score.scienceScore;

      // Science score calculation: scienceSet * 7 + gear^2 + compass^2 + tablet^2
      const scienceSet = Math.min(compass, gear, tablet);
      const scienceScoreSum =
        scienceSet * 7 +
        (gear > 0 ? gear * gear : 0) +
        (compass > 0 ? compass * compass : 0) +
        (tablet > 0 ? tablet * tablet : 0);

      // Total sum calculation
      const scoreSum = Object.values(score).reduce<number>((sum, value) => {
        if (typeof value === 'number') {
          return sum + value;
        }
        if (
          typeof value === 'object' &&
          'gear' in value &&
          'compass' in value &&
          'tablet' in value
        ) {
          return sum + scienceScoreSum;
        }
        return sum;
      }, 0);

      return {
        ...score,
        scienceScore: {
          ...score.scienceScore,
          sum: scienceScoreSum,
        },
        sum: scoreSum,
      };
    })
);

/**
 * Factory selector to get score by username
 * Usage: store.select(selectScoreByUsername('player1'))
 */
export const selectScoreByUsername = (username: string) =>
  createSelector(selectComputedScores, (scores) =>
    scores.find((s) => s.username === username)
  );
