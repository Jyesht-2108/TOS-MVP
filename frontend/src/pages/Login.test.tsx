import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Login } from './Login';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the auth service
vi.mock('@/services/auth.service', () => ({
  authService: {
    login: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
    getToken: vi.fn(),
    isAuthenticated: vi.fn(),
  },
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderLogin = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form with all required elements', () => {
    renderLogin();
    
    expect(screen.getByText('Transport Operations')).toBeInTheDocument();
    expect(screen.getByText('Sign in to access the system')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders demo credential buttons', () => {
    renderLogin();
    
    expect(screen.getByText('Quick Login (Demo Mode)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Admin' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Parent' })).toBeInTheDocument();
  });

  it('updates email and password fields on input', () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText('Email Address') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    
    fireEvent.change(emailInput, { target: { value: 'admin@school.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput.value).toBe('admin@school.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('populates fields when Admin quick login is clicked', () => {
    renderLogin();
    
    const adminButton = screen.getByRole('button', { name: 'Admin' });
    fireEvent.click(adminButton);
    
    const emailInput = screen.getByLabelText('Email Address') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    
    expect(emailInput.value).toBe('admin@school.com');
    expect(passwordInput.value).toBe('admin123');
  });

  it('populates fields when Parent quick login is clicked', () => {
    renderLogin();
    
    const parentButton = screen.getByRole('button', { name: 'Parent' });
    fireEvent.click(parentButton);
    
    const emailInput = screen.getByLabelText('Email Address') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    
    expect(emailInput.value).toBe('parent@school.com');
    expect(passwordInput.value).toBe('parent123');
  });

  it('disables form inputs and buttons during loading', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    const adminButton = screen.getByRole('button', { name: 'Admin' });
    
    fireEvent.change(emailInput, { target: { value: 'admin@school.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    fireEvent.click(submitButton);
    
    // During loading, inputs and buttons should be disabled
    await waitFor(() => {
      expect(emailInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
      expect(adminButton).toBeDisabled();
    });
  });

  it('displays loading state when form is submitted', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(emailInput, { target: { value: 'admin@school.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Signing in...')).toBeInTheDocument();
    });
  });
});
