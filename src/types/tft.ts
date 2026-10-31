export interface League {
  id: string;
  name: string;
  country: string;
  tier: number;
  totalMatches: number;
  teamsCount: number;
  avgGoals: number;
  eloBaseline: number;
}

export interface MatchSequenceItem {
  matchIndex: number;
  date: string;
  opponent: string;
  isHome: boolean;
  teamGoals: number;
  oppGoals: number;
  xG: number;
  xGA: number;
  possession: number;
  shotsOnTarget: number;
  restDays: number;
  eloRating: number;
  eloDiff: number;
  closingOddsHome: number;
  closingOddsDraw: number;
  closingOddsAway: number;
  attentionWeight: number; // learned TFT temporal attention weight
}

export interface TeamProfile {
  id: string;
  name: string;
  shortName: string;
  leagueId: string;
  currentElo: number;
  seasonRank: number;
  rollingForm: ('W' | 'D' | 'L')[];
  recentSequences: MatchSequenceItem[];
  color: string;
  stadiumAltitudeMeters: number;
}

export interface TFTConfig {
  lookbackMatches: number; // 5 to 30
  dModel: number; // 64, 128, 256
  attentionHeads: number; // 1, 4, 8
  dropout: number; // 0.1 to 0.3
  learningRate: number; // e.g. 0.001
  batchSize: number; // 64, 128, 256
  maxEpochs: number; // 20 to 50
  selectedLeague: string; // 'all' or specific league ID
  quantiles: number[]; // [0.1, 0.5, 0.9]
  includeElo: boolean;
  includeBettingOdds: boolean;
  includeRollingXG: boolean;
  includeRestDays: boolean;
}

export interface EpochLog {
  epoch: number;
  trainLoss: number;
  valLoss: number;
  valRpsLoss: number;
  valAccuracy: number;
  valLogLoss: number;
  learningRate: number;
  durationSec: number;
}

export interface VSNFeatureImportance {
  featureName: string;
  category: 'past_observed' | 'static_covariate' | 'known_future';
  weight: number; // 0 to 1
  description: string;
}

export interface BacktestTrade {
  id: string;
  date: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  predictedOutcome: '1' | 'X' | '2';
  confidence: number;
  actualOutcome: '1' | 'X' | '2';
  marketOdds: number;
  modelProb: number;
  marketProb: number;
  edge: number;
  stakePercent: number;
  profitUnit: number;
  cumulativePnl: number;
  wasWin: boolean;
}

export interface BacktestSummary {
  totalBets: number;
  winRate: number;
  brierScoreTFT: number;
  brierScoreMarket: number;
  rankedProbScore: number;
  totalRoiPercent: number;
  sharpeRatio: number;
  maxDrawdownPercent: number;
  alphaVsMarket: number;
}
