import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { User } from '@/types';
import apiClient from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// Mock users for development (when backend is not available)
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@school.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: '2',
    email: 'teacher@school.com',
    password: 'teacher123',
    name: 'John Teacher',
    role: 'teacher',
  },
  {
    id: '3',
    email: 'student@school.com',
    password: 'student123',
    name: 'Jane Student',
    role: 'student',
  },
  {
    id: '4',
    email: 'parent@school.com',
    password: 'parent123',
    name: 'Bob Parent',
    role: 'parent',
  },
  {
    id: '5',
    email: 'accountant@school.com',
    password: 'accountant123',
    name: 'Alice Accountant',
    role: 'accountant',
  },
  {
    id: '6',
    email: 'admissions@school.com',
    password: 'admissions123',
    name: 'Tom Admissions',
    role: 'admissions_staff',
  },
];

const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, setAuth, clearAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        if (USE_MOCK_AUTH) {
          // Mock: restore user from localStorage
          const storedUser = localStorage.getItem('mockUser');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            setAuth(userData, token, '');
          }
        } else {
          // Real API
          try {
            const response = await apiClient.get('/api/auth/me');
            setAuth(response.data, token, localStorage.getItem('refreshToken') || '');
          } catch (error) {
            clearAuth();
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    if (USE_MOCK_AUTH) {
      // Mock authentication
      const mockUser = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      );

      if (!mockUser) {
        throw new Error('Invalid credentials');
      }

      const { password: _, ...userWithoutPassword } = mockUser;
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      localStorage.setItem('mockUser', JSON.stringify(userWithoutPassword));
      setAuth(userWithoutPassword as any, mockToken, '');
      return userWithoutPassword as any;
    } else {
      // Real API authentication
      const response = await apiClient.post('/api/auth/login', { email, password });
      const { accessToken, refreshToken, user } = response.data;
      setAuth(user, accessToken, refreshToken);
      return user;
    }
  };

  const logout = async () => {
    if (USE_MOCK_AUTH) {
      localStorage.removeItem('mockUser');
      clearAuth();
    } else {
      try {
        await apiClient.post('/api/auth/logout');
      } finally {
        clearAuth();
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
