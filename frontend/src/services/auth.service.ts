import api from '@/lib/api';
import { LoginRequest, LoginResponse, User } from '@/types';

// Mock users for development
const MOCK_USERS = {
  '+1234567890': {
    phone: '+1234567890',
    password: 'admin123',
    user: {
      id: '550e8400-e29b-41d4-a716-446655440001',
      tenantId: '550e8400-e29b-41d4-a716-446655440000',
      role: 'ADMIN' as const,
      phone: '+1234567890',
      name: 'Admin User',
      status: 'ACTIVE' as const,
    },
  },
  '+1122334455': {
    phone: '+1122334455',
    password: 'parent123',
    user: {
      id: '550e8400-e29b-41d4-a716-446655440002',
      tenantId: '550e8400-e29b-41d4-a716-446655440000',
      role: 'PARENT' as const,
      phone: '+1122334455',
      name: 'Parent User',
      status: 'ACTIVE' as const,
    },
  },
};

// Check if we should use mock data (when backend is not available)
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.DEV;

class AuthService {
  /**
   * Login with phone and password
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Use mock authentication if enabled
    if (USE_MOCK) {
      return this.mockLogin(credentials);
    }

    const response = await api.post<LoginResponse>('/auth/login', credentials);
    
    // Store token and user in localStorage
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  }

  /**
   * Mock login for development
   */
  private async mockLogin(credentials: LoginRequest): Promise<LoginResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockUser = MOCK_USERS[credentials.phone as keyof typeof MOCK_USERS];

    if (!mockUser || mockUser.password !== credentials.password) {
      throw new Error('Invalid credentials');
    }

    const mockToken = `mock-jwt-token-${mockUser.user.id}`;
    const response: LoginResponse = {
      token: mockToken,
      user: mockUser.user,
    };

    // Store token and user in localStorage
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));

    return response;
  }

  /**
   * Logout - clear local storage and token
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    
    if (!userStr) {
      return null;
    }
    
    try {
      return JSON.parse(userStr) as User;
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
      return null;
    }
  }

  /**
   * Get current auth token
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
