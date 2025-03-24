import { create } from 'zustand';
import { Game, GameState, KenoGame, BingoGame, LottoGame } from '@/types/games';
import { featuredGames, popularGames, kenoGame, bingoGame, lottoGame } from '@/mocks/games';

const initialState: GameState = {
  games: [...featuredGames, ...popularGames],
  activeGame: null,
  isLoading: false,
  error: null,
};

export const useGameStore = create<
  GameState & {
    fetchGames: () => Promise<void>;
    setActiveGame: (gameId: string) => Promise<void>;
    resetActiveGame: () => void;
    // Keno specific actions
    selectKenoNumber: (number: number) => void;
    clearKenoSelection: () => void;
    startKenoDraw: () => Promise<void>;
    // Bingo specific actions
    markBingoCell: (row: number, col: number) => void;
    startBingoGame: () => Promise<void>;
    // Lotto specific actions
    selectLottoNumber: (number: number) => void;
    selectLottoBonusNumber: (number: number) => void;
    clearLottoSelection: () => void;
    buyLottoTicket: () => Promise<void>;
  }
>((set, get) => ({
  ...initialState,
  fetchGames: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In a real app, we would fetch games from an API
      set({ 
        games: [...featuredGames, ...popularGames],
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch