import { create } from 'zustand';
import { User } from '@/types';
import { authService } from '@/services/auth.service';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user) => 
    set({ 
      user, 
      isAuthenticated: !!user 
    }),

  setToken: (token) => 
    set({ token }),

  setLoading: (loading) => 
    set({ isLoading: loading }),

  setError: (error) => 
    set({ error }),

  logout: () => {
    authService.logout();
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false,
      error: null 
    });
  },

  initialize: () => {
    const user = authService.getCurrentUser();
    const token = authService.getToken();
    
    set({ 
      user, 
      token, 
      isAuthenticated: !!user && !!token 
    });
  },
}));
