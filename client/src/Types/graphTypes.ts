export type UserAllGamesSchema = {
  gameName: string;
  totalTime: number;
};

export type UserPercentTimeSchema = {
  gameName: string;
  percentPlayed: number;
};

export type LeaderBoardSchema = {
  name: string;
  game: string;
  timePlayed: number;
};

export type UserSessionSchema = {
  numSessions: number;
  avgSession: number;
};
