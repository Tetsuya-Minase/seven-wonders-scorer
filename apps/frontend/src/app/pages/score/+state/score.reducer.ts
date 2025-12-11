import { createReducer, on } from '@ngrx/store';
import { ScoreState } from '../state/score-state';
import { ScoreActions, ScoreApiActions } from './score.actions';

/**
 * NgRx state interface for scores
 */
export interface ScoresState {
  scores: ScoreState[];
}

/**
 * Initial state
 */
export const initialState: ScoresState = {
  scores: [],
};

/**
 * Default score values for new user
 */
const DEFAULT_SCORE: Omit<ScoreState, 'username'> = {
  civilScore: 0,
  militaryScore: 0,
  scienceScore: { gear: 0, compass: 0, tablet: 0 },
  commercialScore: 0,
  guildScore: 0,
  cityScore: 0,
  leaderScore: 0,
  coinScore: 0,
  wonderScore: 0,
};

/**
 * Helper function to update a single score field
 */
function updateScoreField(
  state: ScoresState,
  username: string,
  field: keyof Omit<ScoreState, 'username' | 'scienceScore'>,
  value: number
): ScoresState {
  return {
    ...state,
    scores: state.scores.map((s) =>
      s.username === username ? { ...s, [field]: value } : s
    ),
  };
}

/**
 * Helper function to normalize score data from WebSocket
 */
function normalizeScoreFromRoomData(score: ScoreState): ScoreState {
  return {
    username: score.username,
    civilScore: score.civilScore ?? 0,
    militaryScore: score.militaryScore ?? 0,
    scienceScore: {
      gear: score.scienceScore?.gear ?? 0,
      compass: score.scienceScore?.compass ?? 0,
      tablet: score.scienceScore?.tablet ?? 0,
    },
    commercialScore: score.commercialScore ?? 0,
    guildScore: score.guildScore ?? 0,
    cityScore: score.cityScore ?? 0,
    leaderScore: score.leaderScore ?? 0,
    coinScore: score.coinScore ?? 0,
    wonderScore: score.wonderScore ?? 0,
  };
}

/**
 * Score reducer
 * Handles all score-related state mutations
 */
export const scoreReducer = createReducer(
  initialState,

  // User management
  on(ScoreActions.addUser, (state, { username }) => ({
    ...state,
    scores: [...state.scores, { username, ...DEFAULT_SCORE }],
  })),

  on(ScoreActions.removeUser, (state, { username }) => ({
    ...state,
    scores: state.scores.filter((s) => s.username !== username),
  })),

  // Individual score updates
  on(ScoreActions.updateCivilScore, (state, { username, score }) =>
    updateScoreField(state, username, 'civilScore', score)
  ),

  on(ScoreActions.updateMilitaryScore, (state, { username, score }) =>
    updateScoreField(state, username, 'militaryScore', score)
  ),

  on(ScoreActions.updateScienceScore, (state, { username, score }) => ({
    ...state,
    scores: state.scores.map((s) =>
      s.username === username ? { ...s, scienceScore: score } : s
    ),
  })),

  on(ScoreActions.updateCommercialScore, (state, { username, score }) =>
    updateScoreField(state, username, 'commercialScore', score)
  ),

  on(ScoreActions.updateGuildScore, (state, { username, score }) =>
    updateScoreField(state, username, 'guildScore', score)
  ),

  on(ScoreActions.updateCityScore, (state, { username, score }) =>
    updateScoreField(state, username, 'cityScore', score)
  ),

  on(ScoreActions.updateLeaderScore, (state, { username, score }) =>
    updateScoreField(state, username, 'leaderScore', score)
  ),

  on(ScoreActions.updateCoinScore, (state, { username, score }) =>
    updateScoreField(state, username, 'coinScore', score)
  ),

  on(ScoreActions.updateWonderScore, (state, { username, score }) =>
    updateScoreField(state, username, 'wonderScore', score)
  ),

  // Bulk update all scores for a user
  on(ScoreActions.updateAllScores, (state, { username, scores }) => ({
    ...state,
    scores: state.scores.map((s) =>
      s.username === username
        ? {
            ...s,
            civilScore: scores.civilScore,
            militaryScore: scores.militaryScore,
            scienceScore: scores.scienceScore,
            commercialScore: scores.commercialScore,
            guildScore: scores.guildScore,
            cityScore: scores.cityScore,
            leaderScore: scores.leaderScore,
            coinScore: scores.coinScore,
            wonderScore: scores.wonderScore,
          }
        : s
    ),
  })),

  // WebSocket sync
  on(
    ScoreActions.syncFromRoomData,
    ScoreApiActions.roomDataReceived,
    (state, { scores }) => ({
      ...state,
      scores: Object.values(scores).map(normalizeScoreFromRoomData),
    })
  ),

  // Clear all scores
  on(ScoreActions.clearAllScores, () => initialState)
);
