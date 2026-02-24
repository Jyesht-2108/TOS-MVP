import api from '@/lib/api';
import { LiveRouteTracking, ChildTransportInfo } from '@/types';

// Check if we should use mock data
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.DEV;

class ParentService {
  /**
   * Fetch live tracking for parent's children routes
   * @returns Promise with array of live route tracking data
   */
  async fetchLiveTracking(): Promise<LiveRouteTracking[]> {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const { getMockLiveTracking, getMockChildrenTransport } = await import('@/lib/mockData');
      
      // Get current user from localStorage
      const userStr = localStorage.getItem('user');
      const currentUser = userStr ? JSON.parse(userStr) : null;
      const parentUserId = currentUser?.id;
      
      // Get parent's children to find their routes
      const children = getMockChildrenTransport(parentUserId);
      const childRouteIds = [...new Set(children.map(c => c.routeId).filter(Boolean))];
      
      // Filter live tracking to only show parent's children's routes
      const allTracking = getMockLiveTracking();
      return allTracking.filter(t => childRouteIds.includes(t.routeId));
    }

    try {
      const response = await api.get<LiveRouteTracking[]>('/parent/live-tracking');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch live tracking:', error);
      throw error;
    }
  }

  /**
   * Fetch live tracking for a specific route
   * @param routeId - The route ID to track
   * @returns Promise with live route tracking data
   */
  async fetchRouteTracking(routeId: string): Promise<LiveRouteTracking> {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const { getMockLiveTracking, getMockChildrenTransport } = await import('@/lib/mockData');
      
      // Get current user from localStorage
      const userStr = localStorage.getItem('user');
      const currentUser = userStr ? JSON.parse(userStr) : null;
      const parentUserId = currentUser?.id;
      
      // Verify parent has access to this route
      const children = getMockChildrenTransport(parentUserId);
      const hasAccess = children.some(c => c.routeId === routeId);
      
      if (!hasAccess) {
        throw new Error('You do not have permission to view this route');
      }
      
      const tracking = getMockLiveTracking().find(t => t.routeId === routeId);
      if (!tracking) {
        throw new Error('Route tracking not found');
      }
      return tracking;
    }

    try {
      const response = await api.get<LiveRouteTracking>(`/parent/routes/${routeId}/tracking`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch route tracking:', error);
      throw error;
    }
  }

  /**
   * Fetch children transport info for parent
   * @returns Promise with array of children transport info
   */
  async fetchChildrenTransport(): Promise<ChildTransportInfo[]> {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const { getMockChildrenTransport } = await import('@/lib/mockData');
      
      // Get current user from localStorage
      const userStr = localStorage.getItem('user');
      const currentUser = userStr ? JSON.parse(userStr) : null;
      const parentUserId = currentUser?.id;
      
      // Filter by parent user ID
      return getMockChildrenTransport(parentUserId);
    }

    try {
      const response = await api.get<ChildTransportInfo[]>('/parent/children/transport');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch children transport:', error);
      throw error;
    }
  }

  /**
   * Fetch child transport details by child ID
   * @param childId - The child ID
   * @returns Promise with child transport info
   */
  async fetchChildTransportDetails(childId: string): Promise<ChildTransportInfo> {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const { getMockChildrenTransport } = await import('@/lib/mockData');
      
      // Get current user from localStorage
      const userStr = localStorage.getItem('user');
      const currentUser = userStr ? JSON.parse(userStr) : null;
      const parentUserId = currentUser?.id;
      
      const children = getMockChildrenTransport(parentUserId);
      const child = children.find(c => c.id === childId);
      if (!child) {
        throw new Error('Child not found or you do not have permission to view this child');
      }
      return child;
    }

    try {
      const response = await api.get<ChildTransportInfo>(`/parent/children/${childId}/transport`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch child transport details:', error);
      throw error;
    }
  }

  /**
   * Fetch parent dashboard statistics
   * @returns Promise with dashboard stats
   */
  async fetchDashboardStats(): Promise<import('@/types').ParentDashboardStats> {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const { getMockChildrenTransport } = await import('@/lib/mockData');
      
      // Get current user from localStorage
      const userStr = localStorage.getItem('user');
      const currentUser = userStr ? JSON.parse(userStr) : null;
      const parentUserId = currentUser?.id;
      
      // Get parent's children
      const children = getMockChildrenTransport(parentUserId);
      const activeRoutes = [...new Set(children.map(c => c.routeId).filter(Boolean))].length;
      
      return {
        myChildren: children.length,
        activeRoutes: activeRoutes,
        upcomingTrips: activeRoutes * 2, // Mock: 2 trips per route (morning + evening)
      };
    }

    try {
      const response = await api.get<import('@/types').ParentDashboardStats>('/parent/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw error;
    }
  }
}

export const parentService = new ParentService();
