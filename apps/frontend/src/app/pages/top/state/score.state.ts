/**
 * Score state
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
 * Score type
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
