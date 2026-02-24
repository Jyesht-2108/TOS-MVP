import api from '@/lib/api';
import { DashboardStats, RecentActivity, RouteResponse, Driver, Student } from '@/types';
import { getRecentActivities, initializeActivities } from '@/lib/activityTracker';

// Check if we should use mock data
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.DEV;

// Initialize activities on first load
if (USE_MOCK) {
  initializeActivities();
}

class AdminService {
  /**
   * Fetch dashboard statistics
   * @returns Promise with dashboard stats
   */
  async fetchDashboardStats(): Promise<DashboardStats> {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Calculate stats dynamically from actual mock data
      const { mockRoutes, mockStudents, mockDrivers } = await import('@/lib/mockData');
      
      const totalRoutes = mockRoutes.length;
      const activeRoutes = mockRoutes.filter(r => r.status === 'ACTIVE').length;
      const totalDrivers = mockDrivers.length;
      const totalStudents = mockStudents.length;
      
      return {
        totalRoutes,
        activeRoutes,
        totalDrivers,
        totalStudents,
      };
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
      
      // Use actual mock routes data
      const { mockRoutes } = await import('@/lib/mockData');
      
      if (status) {
        return mockRoutes.filter(route => route.status === status);
      }
      return mockRoutes;
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
      const { mockDrivers } = await import('@/lib/mockData');
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
