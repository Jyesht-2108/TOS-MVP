import api from '@/lib/api';
import { DashboardStats, RecentActivity, RouteResponse, Driver, Student } from '@/types';
import { mockDrivers } from '@/lib/mockData';

// Check if we should use mock data
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.DEV;

// Mock data for development
const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalRoutes: 12,
  activeRoutes: 8,
  totalDrivers: 15,
  totalStudents: 245,
};

const MOCK_RECENT_ACTIVITY: RecentActivity[] = [
  {
    id: '1',
    type: 'ROUTE_CREATED',
    description: 'New route "Morning Route A" created',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    userId: '550e8400-e29b-41d4-a716-446655440001',
    userName: 'Admin User',
  },
  {
    id: '2',
    type: 'DRIVER_ASSIGNED',
    description: 'Driver John Smith assigned to Route B',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    userId: '550e8400-e29b-41d4-a716-446655440001',
    userName: 'Admin User',
  },
  {
    id: '3',
    type: 'STUDENT_ASSIGNED',
    description: '5 students assigned to Morning Route A',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    userId: '550e8400-e29b-41d4-a716-446655440001',
    userName: 'Admin User',
  },
  {
    id: '4',
    type: 'ROUTE_UPDATED',
    description: 'Route "Evening Route C" status changed to Active',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    userId: '550e8400-e29b-41d4-a716-446655440001',
    userName: 'Admin User',
  },
];

const MOCK_ROUTES: RouteResponse[] = [
  {
    id: '1',
    tenantId: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Morning Route A',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    driverName: 'John Smith',
    studentCount: 25,
  },
  {
    id: '2',
    tenantId: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Morning Route B',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    driverName: 'Sarah Johnson',
    studentCount: 30,
  },
  {
    id: '3',
    tenantId: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Evening Route A',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    driverName: 'Mike Davis',
    studentCount: 28,
  },
  {
    id: '4',
    tenantId: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Evening Route B',
    status: 'INACTIVE',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    studentCount: 0,
  },
];

class AdminService {
  /**
   * Fetch dashboard statistics
   * @returns Promise with dashboard stats
   */
  async fetchDashboardStats(): Promise<DashboardStats> {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return MOCK_DASHBOARD_STATS;
    }

    try {
      const response = await api.get<DashboardStats>('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw error;
    }
  }

  /**
   * Fetch recent activity
   * @param limit - Number of activities to fetch
   * @returns Promise with array of recent activities
   */
  async fetchRecentActivity(limit: number = 10): Promise<RecentActivity[]> {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return MOCK_RECENT_ACTIVITY.slice(0, limit);
    }

    try {
      const response = await api.get<RecentActivity[]>('/admin/dashboard/activity', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch recent activity:', error);
      throw error;
    }
  }

  /**
   * Fetch route overview for admin dashboard
   * @param status - Optional filter by route status
   * @returns Promise with array of routes
   */
  async fetchRouteOverview(status?: 'ACTIVE' | 'INACTIVE'): Promise<RouteResponse[]> {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (status) {
        return MOCK_ROUTES.filter(route => route.status === status);
      }
      return MOCK_ROUTES;
    }

    try {
      const params = status ? { status } : {};
      const response = await api.get<RouteResponse[]>('/admin/routes', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch route overview:', error);
      throw error;
    }
  }

  /**
   * Fetch all drivers for admin management
   * @returns Promise with array of drivers
   */
  async fetchDrivers(): Promise<Driver[]> {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockDrivers;
    }

    try {
      const response = await api.get<Driver[]>('/admin/drivers');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch drivers:', error);
      throw error;
    }
  }

  /**
   * Fetch all students for admin management
   * @returns Promise with array of students
   */
  async fetchStudents(): Promise<Student[]> {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const { mockStudents } = await import('@/lib/mockData');
      return mockStudents;
    }

    try {
      const response = await api.get<Student[]>('/admin/students');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch students:', error);
      throw error;
    }
  }
}

export const adminService = new AdminService();
