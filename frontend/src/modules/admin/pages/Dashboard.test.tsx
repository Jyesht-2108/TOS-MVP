import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminDashboard } from './Dashboard';
import { useAuthStore } from '@/stores/authStore';
import { adminService } from '@/services/admin.service';

// Mock the stores and services
vi.mock('@/stores/authStore');
vi.mock('@/services/admin.service');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock auth store
    vi.mocked(useAuthStore).mockReturnValue({
      user: {
        id: '1',
        tenantId: 'tenant-1',
        role: 'ADMIN',
        email: 'admin@school.com',
        name: 'John Admin',
        status: 'ACTIVE',
      },
      token: 'mock-token',
      isAuthenticated: true,
      isLoading: false,
      error: null,
      setUser: vi.fn(),
      setToken: vi.fn(),
      setLoading: vi.fn(),
      setError: vi.fn(),
      logout: vi.fn(),
      initialize: vi.fn(),
    });
  });

  it('renders welcome header with user name', () => {
    // Mock successful API responses
    vi.mocked(adminService.fetchDashboardStats).mockResolvedValue({
      totalRoutes: 10,
      activeRoutes: 8,
      totalDrivers: 15,
      totalStudents: 200,
    });
    
    vi.mocked(adminService.fetchRecentActivity).mockResolvedValue([]);

    render(<AdminDashboard />, { wrapper: createWrapper() });

    expect(screen.getByText('Welcome back, John Admin')).toBeDefined();
    expect(screen.getByText("Here's what's happening with your transport operations today.")).toBeDefined();
  });

  it('displays loading skeletons while fetching data', () => {
    // Mock pending API responses
    vi.mocked(adminService.fetchDashboardStats).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );
    
    vi.mocked(adminService.fetchRecentActivity).mockImplementation(
      () => new Promise(() => {})
    );

    render(<AdminDashboard />, { wrapper: createWrapper() });

    // Should show loading skeletons
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('displays stat cards with correct data', async () => {
    // Mock successful API responses
    vi.mocked(adminService.fetchDashboardStats).mockResolvedValue({
      totalRoutes: 10,
      activeRoutes: 8,
      totalDrivers: 15,
      totalStudents: 200,
    });
    
    vi.mocked(adminService.fetchRecentActivity).mockResolvedValue([]);

    render(<AdminDashboard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Total Routes')).toBeDefined();
      expect(screen.getByText('10')).toBeDefined();
      expect(screen.getByText('Active Routes')).toBeDefined();
      expect(screen.getByText('8')).toBeDefined();
      expect(screen.getByText('Total Drivers')).toBeDefined();
      expect(screen.getByText('15')).toBeDefined();
      expect(screen.getByText('Total Students')).toBeDefined();
      expect(screen.getByText('200')).toBeDefined();
    });
  });

  it('displays recent activity when available', async () => {
    vi.mocked(adminService.fetchDashboardStats).mockResolvedValue({
      totalRoutes: 10,
      activeRoutes: 8,
      totalDrivers: 15,
      totalStudents: 200,
    });
    
    vi.mocked(adminService.fetchRecentActivity).mockResolvedValue([
      {
        id: '1',
        type: 'ROUTE_CREATED',
        description: 'New route "Route A" created',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'DRIVER_ASSIGNED',
        description: 'Driver assigned to Route B',
        timestamp: new Date().toISOString(),
      },
    ]);

    render(<AdminDashboard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Recent Activity')).toBeDefined();
      expect(screen.getByText('New route "Route A" created')).toBeDefined();
      expect(screen.getByText('Driver assigned to Route B')).toBeDefined();
    });
  });

  it('displays quick action buttons', () => {
    vi.mocked(adminService.fetchDashboardStats).mockResolvedValue({
      totalRoutes: 10,
      activeRoutes: 8,
      totalDrivers: 15,
      totalStudents: 200,
    });
    
    vi.mocked(adminService.fetchRecentActivity).mockResolvedValue([]);

    render(<AdminDashboard />, { wrapper: createWrapper() });

    expect(screen.getByText('Quick Actions')).toBeDefined();
    expect(screen.getByText('Create New Route')).toBeDefined();
    expect(screen.getByText('Assign Driver')).toBeDefined();
    expect(screen.getByText('View Reports')).toBeDefined();
  });

  it('handles error when fetching stats', async () => {
    vi.mocked(adminService.fetchDashboardStats).mockRejectedValue(
      new Error('Failed to fetch stats')
    );
    
    vi.mocked(adminService.fetchRecentActivity).mockResolvedValue([]);

    render(<AdminDashboard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Failed to load dashboard statistics. Please try again later.')).toBeDefined();
    });
  });

  it('shows empty state when no recent activity', async () => {
    vi.mocked(adminService.fetchDashboardStats).mockResolvedValue({
      totalRoutes: 10,
      activeRoutes: 8,
      totalDrivers: 15,
      totalStudents: 200,
    });
    
    vi.mocked(adminService.fetchRecentActivity).mockResolvedValue([]);

    render(<AdminDashboard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('No recent activity to display.')).toBeDefined();
    });
  });
});
