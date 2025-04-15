import { Injectable } from '@angular/core';
import { ScoreListState } from '../state/score-list.state';
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

@Injectable()
export class ScoreService {
  readonly #state;
  constructor(private readonly scoreListState: ScoreListState) {
    this.#state = scoreListState.asReadonly();
  }

  public updateScore(username: string, score: UpdateScore) {
    this.scoreListState.updateCivilScore(username, score.civilScore);
    this.scoreListState.updateMilitaryScore(username, score.militaryScore);
    this.scoreListState.updateScienceScore(username, {
      gear: score.scienceScore.gear,
      compass: score.scienceScore.compass,
      tablet: score.scienceScore.tablet,
    });
    this.scoreListState.updateCommercialScore(username, score.commercialScore);
    this.scoreListState.updateGuildScore(username, score.guildScore);
    this.scoreListState.updateCityScore(username, score.cityScore);
    this.scoreListState.updateLeaderScore(username, score.leaderScore);
    this.scoreListState.updateCoinScore(username, score.coinScore);
    this.scoreListState.updateWonderScore(username, score.wonderScore);
  }

  public getScoreByUsername(username: string): Score | undefined {
    return this.getScore().find((score) => score.username === username);
  }

  public getScore(): Score[] {
    return this.#state.scores().map((score) => {
      const scienceSet = Math.min(
        score.scienceScore.compass,
        score.scienceScore.gear,
        score.scienceScore.tablet
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
        0
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
