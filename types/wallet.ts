export type TransactionType = 'deposit' | 'withdrawal' | 'bet' | 'win' | 'bonus';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  gameId?: string;
  gameName?: string;
  reference?: string;
}

export interface WalletState {
  balance: number;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}