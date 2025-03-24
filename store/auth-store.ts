import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, LoginCredentials, RegisterCredentials, User } from '@/types/auth';
import { mockUser } from '@/mocks/users';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<
  AuthState & {
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => void;
    updateUser: (user: Partial<User>) => void;
  }
>(
  persist(
    (set) => ({
      ...initialState,
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // For demo purposes, we'll accept any credentials and return the mock user
          if (credentials.email && credentials.password) {
            set({ user: mockUser, isAuthenticated: true, isLoading: false });
          } else {
            throw new Error('Invalid credentials');
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed', 
            isLoading: false 
          });
        }
      },
      register: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1500));
          
          // For demo purposes, we'll accept any credentials and return the mock user
          if (credentials.email && credentials.password && credentials.username) {
            const newUser: User = {
              ...mockUser,
              username: credentials.username,
              email: credentials.email,
            };
            set({ user: newUser, isAuthenticated: true, isLoading: false });
          } else {
            throw new Error('Invalid registration data');
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Registration failed', 
            isLoading: false 
          });
        }
      },
      logout: () => {
        set(initialState);
      },
      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);