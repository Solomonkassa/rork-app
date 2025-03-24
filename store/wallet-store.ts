import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WalletState, Transaction, TransactionType } from '@/types/wallet';
import { mockTransactions } from '@/mocks/transactions';

const initialState: WalletState = {
  balance: 1000,
  transactions: mockTransactions,
  isLoading: false,
  error: null,
};

export const useWalletStore = create<
  WalletState & {
    deposit: (amount: number) => Promise<void>;
    withdraw: (amount: number) => Promise<void>;
    placeBet: (amount: number, gameId: string, gameName: string) => Promise<void>;
    recordWin: (amount: number, gameId: string, gameName: string) => Promise<void>;
    addBonus: (amount: number, reference: string) => Promise<void>;
    fetchTransactions: () => Promise<void>;
  }
>(
  persist(
    (set, get) => ({
      ...initialState,
      deposit: async (amount: number) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          const newTransaction: Transaction = {
            id: Date.now().toString(),
            type: 'deposit',
            amount,
            status: 'completed',
            timestamp: new Date().toISOString(),
            reference: `DEP${Math.floor(Math.random() * 1000000)}`,
          };
          
          set((state) => ({
            balance: state.balance + amount,
            transactions: [newTransaction, ...state.transactions],
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Deposit failed', 
            isLoading: false 
          });
        }
      },
      withdraw: async (amount: number) => {
        set({ isLoading: true, error: null });
        try {
          // Check if there's enough balance
          const currentBalance = get().balance;
          if (currentBalance < amount) {
            throw new Error('Insufficient balance');
          }
          
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1500));
          
          const newTransaction: Transaction = {
            id: Date.now().toString(),
            type: 'withdrawal',
            amount: -amount, // Negative amount for withdrawals
            status: 'pending', // Withdrawals are usually pending until processed
            timestamp: new Date().toISOString(),
            reference: `WD${Math.floor(Math.random() * 1000000)}`,
          };
          
          set((state) => ({
            balance: state.balance - amount,
            transactions: [newTransaction, ...state.transactions],
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Withdrawal failed', 
            isLoading: false 
          });
        }
      },
      placeBet: async (amount: number, gameId: string, gameName: string) => {
        set({ isLoading: true, error: null });
        try {
          // Check if there's enough balance
          const currentBalance = get().balance;
          if (currentBalance < amount) {
            throw new Error('Insufficient balance');
          }
          
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 800));
          
          const newTransaction: Transaction = {
            id: Date.now().toString(),
            type: 'bet',
            amount: -amount, // Negative amount for bets
            status: 'completed',
            timestamp: new Date().toISOString(),
            gameId,
            gameName,
          };
          
          set((state) => ({
            balance: state.balance - amount,
            transactions: [newTransaction, ...state.transactions],
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Bet placement failed', 
            isLoading: false 
          });
        }
      },
      recordWin: async (amount: number, gameId: string, gameName: string) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 800));
          
          const newTransaction: Transaction = {
            id: Date.now().toString(),
            type: 'win',
            amount, // Positive amount for wins
            status: 'completed',
            timestamp: new Date().toISOString(),
            gameId,
            gameName,
          };
          
          set((state) => ({
            balance: state.balance + amount,
            transactions: [newTransaction, ...state.transactions],
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Win recording failed', 
            isLoading: false 
          });
        }
      },
      addBonus: async (amount: number, reference: string) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 800));
          
          const newTransaction: Transaction = {
            id: Date.now().toString(),
            type: 'bonus',
            amount, // Positive amount for bonuses
            status: 'completed',
            timestamp: new Date().toISOString(),
            reference,
          };
          
          set((state) => ({
            balance: state.balance + amount,
            transactions: [newTransaction, ...state.transactions],
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Bonus addition failed', 
            isLoading: false 
          });
        }
      },
      fetchTransactions: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // In a real app, we would fetch transactions from an API
          set({ 
            transactions: mockTransactions,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch transactions', 
            isLoading: false 
          });
        }
      },
    }),
    {
      name: 'wallet-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);