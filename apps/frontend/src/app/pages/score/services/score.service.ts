import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { Score } from '../types/score';
import { ScoreActions, selectComputedScores } from '../+state';

/**
 * UpdateScore type for bulk score updates
 */
export type UpdateScore = Readonly<{
  civilScore: number;
  militaryScore: number;
  scienceScore: Readonly<{
    gear: number;
    compass: number;
    tablet: number;
  }>;
  commercialScore: number;
  guildScore: number;
  cityScore: number;
  leaderScore: number;
  coinScore: number;
  wonderScore: number;
}>;

/**
 * ScoreService - NgRx Facade
 * Provides a simplified API for components to interact with score state.
 * Internally uses NgRx Store for state management.
 */
@Injectable({
  providedIn: 'root',
})
export class ScoreService {
  private readonly store = inject(Store);

  /**
   * Signal-based access to computed scores
   * Maintains compatibility with existing component usage
   */
  readonly #computedScores = toSignal(
    this.store.select(selectComputedScores),
    { initialValue: [] }
  );

  /**
   * Get all scores with computed sums
   * @returns Array of Score objects with calculated science and total sums
   */
  public getScore(): Score[] {
    return this.#computedScores();
  }

  /**
   * Get score for a specific user
   * @param username target username
   * @returns Score object for the user, or undefined if not found
   */
  public getScoreByUsername(username: string): Score | undefined {
    return this.getScore().find((score) => score.username === username);
  }

  /**
   * Update all scores for a user
   * Dispatches UpdateAllScores action to the store
   * @param username target username
   * @param score updated scores
   */
  public updateScore(username: string, score: UpdateScore): void {
    this.store.dispatch(ScoreActions.updateAllScores({ username, scores: score }));
  }

  /**
   * Update civil score for a user
   * @param username target username
   * @param score updated score value
   */
  public updateCivilScore(username: string, score: number): void {
    this.store.dispatch(ScoreActions.updateCivilScore({ username, score }));
  }

  /**
   * Update military score for a user
   * @param username target username
   * @param score updated score value
   */
  public updateMilitaryScore(username: string, score: number): void {
    this.store.dispatch(ScoreActions.updateMilitaryScore({ username, score }));
  }

  /**
   * Update science score for a user
   * @param username target username
   * @param score updated science score values
   */
  public updateScienceScore(
    username: string,
    score: { gear: number; compass: number; tablet: number }
  ): void {
    this.store.dispatch(ScoreActions.updateScienceScore({ username, score }));
  }

  /**
   * Update commercial score for a user
   * @param username target username
   * @param score updated score value
   */
  public updateCommercialScore(username: string, score: number): void {
    this.store.dispatch(ScoreActions.updateCommercialScore({ username, score }));
  }

  /**
   * Update guild score for a user
   * @param username target username
   * @param score updated score value
   */
  public updateGuildScore(username: string, score: number): void {
    this.store.dispatch(ScoreActions.updateGuildScore({ username, score }));
  }

  /**
   * Update city score for a user
   * @param username target username
   * @param score updated score value
   */
  public updateCityScore(username: string, score: number): void {
    this.store.dispatch(ScoreActions.updateCityScore({ username, score }));
  }

  /**
   * Update leader score for a user
   * @param username target username
   * @param score updated score value
   */
  public updateLeaderScore(username: string, score: number): void {
    this.store.dispatch(ScoreActions.updateLeaderScore({ username, score }));
  }

  /**
   * Update coin score for a user
   * @param username target username
   * @param score updated score value
   */
  public updateCoinScore(username: string, score: number): void {
    this.store.dispatch(ScoreActions.updateCoinScore({ username, score }));
  }

  /**
   * Update wonder score for a user
   * @param username target username
   * @param score updated score value
   */
  public updateWonderScore(username: string, score: number): void {
    this.store.dispatch(ScoreActions.updateWonderScore({ username, score }));
  }
}
