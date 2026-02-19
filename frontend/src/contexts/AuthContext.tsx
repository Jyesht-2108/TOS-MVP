import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, LoginRequest, LoginResponse } from '@/types';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/authStore';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user, isAuthenticated, setUser, setToken, logout: storeLogout, initialize } = useAuthStore();

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response: LoginResponse = await authService.login(credentials);
      
      setUser(response.user);
      setToken(response.token);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    storeLogout();
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
