export type GameType = 'keno' | 'bingo' | 'lotto';

export interface Game {
  id: string;
  type: GameType;
  name: string;
  description: string;
  minBet: number;
  maxBet: number;
  image: string;
  isLive: boolean;
  startTime?: string;
  players?: number;
}

// Keno specific types
export interface KenoGame extends Game {
  type: 'keno';
  selectedNumbers: number[];
  drawnNumbers: number[];
  maxSelections: number;
  payoutTable: Record<number, number>;
  status: 'waiting' | 'drawing' | 'complete';
}

// Bingo specific types
export interface BingoGame extends Game {
  type: 'bingo';
  card: number[][];
  markedPositions: [number, number][];
  drawnNumbers: number[];
  status: 'waiting' | 'playing' | 'complete';
  winPatterns: string[];
}

// Lotto specific types
export interface LottoGame extends Game {
  type: 'lotto';
  selectedNumbers: number[];
  bonusNumbers: number[];
  drawnNumbers: number[];
  bonusDrawnNumbers: number[];
  jackpot: number;
  drawDate: string;
  status: 'open' | 'closed' | 'drawn';
}

export interface GameState {
  games: Game[];
  activeGame: KenoGame | BingoGame | LottoGame | null;
  isLoading: boolean;
  error: string | null;
}