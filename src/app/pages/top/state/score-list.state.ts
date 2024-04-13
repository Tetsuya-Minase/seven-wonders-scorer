import { Injectable, signal } from '@angular/core';
import { SignalState } from '../../../types/signal-state';
import { Score, ScoreType } from './score.state';

export type State = {
  scores: Score[];
};

@Injectable()
export class ScoreListState implements SignalState<State> {
  #scoreList = signal<Score[]>([]);

  /**
   * add new user to score list
   * @param username target username
   */
  public addUser(username: string): void {
    const newUser: Score = {
      username,
      civilScore: 0,
      militaryScore: 0,
      scienceScore: {
        gear: 0,
        compass: 0,
        tablet: 0,
      },
      commercialScore: 0,
      guildScore: 0,
      cityScore: 0,
      leaderScore: 0,
      coinScore: 0,
      wonderScore: 0,
    };
    this.#scoreList.update((scores) => [...scores, newUser]);
  }

  /**
   * remove user from score list
   * @param username target username
   */
  public removeUser(username: string): void {
    this.#scoreList.update((scores) => {
      return scores.filter((score) => score.username !== username);
    });
  }

  /**
   * update civilization score
   * @param username target username
   * @param score updated score
   */
  public updateCivilScore(username: string, score: number): void {
    this.updateScore(username, { score, scoreType: ScoreType.Civilization });
  }

  /**
   * update military score
   * @param username target username
   * @param score updated score
   */
  public updateMilitaryScore(username: string, score: number): void {
    this.updateScore(username, { score, scoreType: ScoreType.Military });
  }

  /**
   * update science score
   * @param username target username
   * @param score updated score
   */
  public updateScienceScore(
    username: string,
    score: Readonly<Record<'gear' | 'compass' | 'tablet', number>>
  ): void {
    this.updateScore(username, {
      gear: score.gear,
      compass: score.compass,
      tablet: score.tablet,
      scoreType: ScoreType.Science,
    });
  }

  /**
   * update commercial score
   * @param username target username
   * @param score updated score
   */
  public updateCommercialScore(username: string, score: number): void {
    this.updateScore(username, { score, scoreType: ScoreType.Commercial });
  }

  /**
   * update guild score
   * @param username target username
   * @param score updated score
   */
  public updateGuildScore(username: string, score: number): void {
    this.updateScore(username, { score, scoreType: ScoreType.Guild });
  }

  /**
   * update city score
   * @param username target username
   * @param score updated score
   */
  public updateCityScore(username: string, score: number): void {
    this.updateScore(username, { score, scoreType: ScoreType.City });
  }

  /**
   * update leader score
   * @param username target username
   * @param score updated score
   */
  public updateLeaderScore(username: string, score: number): void {
    this.updateScore(username, { score, scoreType: ScoreType.Leader });
  }

  /**
   * update coin score
   * @param username target username
   * @param score updated score
   */
  public updateCoinScore(username: string, score: number): void {
    this.updateScore(username, { score, scoreType: ScoreType.Coin });
  }

  /**
   * update wonder score
   * @param username target username
   * @param score updated score
   */
  public updateWonderScore(username: string, score: number): void {
    this.updateScore(username, { score, scoreType: ScoreType.Wonder });
  }

  /**
   * get readonly state
   */
  public asReadonly() {
    return {
      scores: this.#scoreList.asReadonly(),
    };
  }

  /**
   * update score
   * @param username target username
   * @param data updated score
   * @param scoreType score type
   * @private
   */
  private updateScore(
    username: string,
    data:
      | Readonly<{
          score: number;
          scoreType: Exclude<ScoreType, typeof ScoreType.Science>;
        }>
      | Readonly<{
          gear: number;
          compass: number;
          tablet: number;
          scoreType: typeof ScoreType.Science;
        }>
  ): void {
    this.#scoreList.update((scores) => {
      return scores.map((s) => {
        if (s.username === username) {
          if (data.scoreType === ScoreType.Science) {
            return {
              ...s,
              scienceScore: {
                gear: data.gear,
                compass: data.compass,
                tablet: data.tablet,
              },
            };
          }
          return {
            ...s,
            [data.scoreType]: data.score,
          };
        }
        return s;
      });
    });
  }
}
