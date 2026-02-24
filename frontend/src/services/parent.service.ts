import api from '@/lib/api';
import { LiveRouteTracking, ChildTransportInfo } from '@/types';

// Check if we should use mock data
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.DEV;

// Mock data for development
const MOCK_LIVE_TRACKING: LiveRouteTracking[] = [
  {
    routeId: 'route-1',
    routeName: 'North District Route',
    vehicleNumber: 'BUS-101',
    driverName: 'John Anderson',
    driverPhone: '+1-555-0101',
    currentLocation: {
      latitude: 40.7128,
      longitude: -74.0060,
      timestamp: new Date().toISOString(),
      speed: 35,
      heading: 180,
    },
    tripStatus: 'ACTIVE',
    lastUpdated: new Date().toISOString(),
    estimatedArrival: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  },
  {
    routeId: 'route-2',
    routeName: 'South District Route',
    vehicleNumber: 'BUS-102',
    driverName: 'Sarah Thompson',
    driverPhone: '+1-555-0102',
    currentLocation: {
      latitude: 40.7580,
      longitude: -73.9855,
      timestamp: new Date().toISOString(),
      speed: 25,
      heading: 90,
    },
    tripStatus: 'ACTIVE',
    lastUpdated: new Date().toISOString(),
    estimatedArrival: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
  },
];

class ParentService {
  /**
   * Fetch live tracking for parent's children routes
   * @returns Promise with array of live route tracking data
   */
  async fetchLiveTracking(): Promise<LiveRouteTracking[]> {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_LIVE_TRACKING;
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
      const tracking = MOCK_LIVE_TRACKING.find(t => t.routeId === routeId);
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
      const { mockChildrenTransport } = await import('@/lib/mockData');
      return mockChildrenTransport;
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
      const { mockChildrenTransport } = await import('@/lib/mockData');
      const child = mockChildrenTransport.find(c => c.id === childId);
      if (!child) {
        throw new Error('Child not found');
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
      return {
        myChildren: 2,
        activeRoutes: 1,
        upcomingTrips: 5,
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
