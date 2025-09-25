/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';

import { AuthService } from '@/api/auth/AuthService';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/api/user/types';
import { FirebaseAuthService } from '@/api/auth/FirebaseAuthService';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  initializeAuth: () => void;
  clearError: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string) => void;
  setUser: (user?: User, token?: string) => void;
  updateUser: (user: User) => void;
  signInWithGoogle: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,

      setLoading: (isLoading: boolean) => set({ isLoading }),

      setError: (error: string) => set({ error }),

      setUser: (user?: User, accessToken?: string) => set({
        user,
        isAuthenticated: !!user,
        token: accessToken || null,
        error: null
      }),

      updateUser: (user: User) => set((state) => ({
        user,
        isAuthenticated: true,
        token: state.token, // Preserve existing token
        error: null
      })),

      login: async (email: string, password: string) => {
        const { setLoading, setError, setUser } = get();

        try {
          setLoading(true);
          setError(null);

          const response = await AuthService.login({
            login: email, password
          });

          setUser(response.user, response.accessToken);
          return;
        } catch (err) {
          const errorMessage = err.message || 'Login failed';
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      },

      signInWithGoogle: async (): Promise<void> => {
        const { setLoading, setError, setUser } = get();

        try {
          setLoading(true);
          setError(null);

          const firebaseUser = await FirebaseAuthService.signInWithGoogle();

          const response = await AuthService.socialLogin({
            token: await firebaseUser.user.getIdToken()
          })

          setUser(response.user, response.accessToken);
          return;
        } catch (err: any) {
          setError(err.message || 'Erro no login social');
          throw err;
        } finally {
          setLoading(false);
        }
      },

      logout: () => {
        set({
          token: null,
          isAuthenticated: false,
          user: null,
        });
      },

      initializeAuth: () => {
        const { token } = get();
        if (token) {
          set({ isAuthenticated: true });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        user: state.user,
      }),
    }
  )
);