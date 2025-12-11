/**
 * Score state type definitions
 * These types are shared between the old Signal-based implementation
 * and the new NgRx-based implementation
 */

/**
 * Score state (raw scores without computed sums)
 */
export type ScoreState = Readonly<{
  username: string;
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
 * Score type constants
 */
export const ScoreType = {
  Civilization: 'civilScore',
  Military: 'militaryScore',
  Science: 'scienceScore',
  Commercial: 'commercialScore',
  Guild: 'guildScore',
  City: 'cityScore',
  Leader: 'leaderScore',
  Coin: 'coinScore',
  Wonder: 'wonderScore',
} as const;

export type ScoreType = (typeof ScoreType)[keyof typeof ScoreType];
