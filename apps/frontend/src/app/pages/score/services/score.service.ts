import { Injectable } from '@angular/core';
import { ScoreStateManager } from '../state/score-state';
import { Score } from '../types/score';

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

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  readonly #state;
  constructor(private readonly scoreStateManager: ScoreStateManager) {
    this.#state = scoreStateManager.asReadonly();
  }

  public updateScore(username: string, score: UpdateScore) {
    this.scoreStateManager.updateCivilScore(username, score.civilScore);
    this.scoreStateManager.updateMilitaryScore(username, score.militaryScore);
    this.scoreStateManager.updateScienceScore(username, {
      gear: score.scienceScore.gear,
      compass: score.scienceScore.compass,
      tablet: score.scienceScore.tablet,
    });
    this.scoreStateManager.updateCommercialScore(username, score.commercialScore);
    this.scoreStateManager.updateGuildScore(username, score.guildScore);
    this.scoreStateManager.updateCityScore(username, score.cityScore);
    this.scoreStateManager.updateLeaderScore(username, score.leaderScore);
    this.scoreStateManager.updateCoinScore(username, score.coinScore);
    this.scoreStateManager.updateWonderScore(username, score.wonderScore);
  }

  public getScoreByUsername(username: string): Score | undefined {
    return this.getScore().find((score) => score.username === username);
  }

  public getScore(): Score[] {
    return this.#state.scores().map((score) => {
      const scienceSet = Math.min(
        score.scienceScore.compass,
        score.scienceScore.gear,
        score.scienceScore.tablet,
      );
      const scienceScoreSum =
        scienceSet * 7 +
        (score.scienceScore.gear > 0
          ? score.scienceScore.gear * score.scienceScore.gear
          : 0) +
        (score.scienceScore.compass > 0
          ? score.scienceScore.compass * score.scienceScore.compass
          : 0) +
        (score.scienceScore.tablet > 0
          ? score.scienceScore.tablet * score.scienceScore.tablet
          : 0);
      const scoreSum = Object.values(score).reduce(
        (sum: number, value): number => {
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
        },
        0,
      );

      return {
        ...score,
        scienceScore: {
          ...score.scienceScore,
          sum: scienceScoreSum,
        },
        sum: scoreSum,
      };
    });
  }
}
