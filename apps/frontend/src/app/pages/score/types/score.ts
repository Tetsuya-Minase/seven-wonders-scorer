export type Score = Readonly<{
  username: string;
  civilScore: number;
  militaryScore: number;
  scienceScore: Readonly<{
    gear: number;
    compass: number;
    tablet: number;
    sum: number;
  }>;
  commercialScore: number;
  guildScore: number;
  cityScore: number;
  leaderScore: number;
  coinScore: number;
  wonderScore: number;
  sum: number;
}>;
