import api from '@/lib/api';
import { DashboardStats, RecentActivity, RouteResponse, Driver, Student } from '@/types';
import { mockDrivers } from '@/lib/mockData';
import { getRecentActivities, initializeActivities } from '@/lib/activityTracker';

// Check if we should use mock data
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.DEV;

// Initialize activities on first load
if (USE_MOCK) {
  initializeActivities();
}

// Mock data for development
const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalRoutes: 12,
  activeRoutes: 8,
  totalDrivers: 15,
  totalStudents: 245,
};

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
      return getRecentActivities(limit);
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

  /**
   * Fetch active trips for live monitoring
   * @returns Promise with array of active trips
   */
  async fetchActiveTrips(): Promise<import('@/types').ActiveTrip[]> {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const { getMockActiveTrips } = await import('@/lib/mockData');
      return getMockActiveTrips();
    }

    try {
      const response = await api.get<import('@/types').ActiveTrip[]>('/admin/trips/active');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch active trips:', error);
      throw error;
    }
  }

  /**
   * Fetch driver activity for monitoring
   * @returns Promise with array of driver activity
   */
  async fetchDriverActivity(): Promise<import('@/types').DriverActivity[]> {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const { getMockDriverActivity } = await import('@/lib/mockData');
      return getMockDriverActivity();
    }

    try {
      const response = await api.get<import('@/types').DriverActivity[]>('/admin/drivers/activity');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch driver activity:', error);
      throw error;
    }
  }

  /**
   * Fetch trip details by trip ID
   * @param tripId - The trip ID
   * @returns Promise with trip details
   */
  async fetchTripDetails(tripId: string): Promise<import('@/types').ActiveTrip> {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const { getMockActiveTrips } = await import('@/lib/mockData');
      const trips = getMockActiveTrips();
      const trip = trips.find(t => t.tripId === tripId);
      if (!trip) {
        throw new Error('Trip not found');
      }
      return trip;
    }

    try {
      const response = await api.get<import('@/types').ActiveTrip>(`/admin/trips/${tripId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch trip details:', error);
      throw error;
    }
  }
}

export const adminService = new AdminService();
