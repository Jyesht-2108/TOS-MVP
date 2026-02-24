import api from '@/lib/api';
import { ParentDashboardStats, ChildTransportInfo } from '@/types';

// Check if we should use mock data
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.DEV;

// Mock data for development
const MOCK_PARENT_STATS: ParentDashboardStats = {
  myChildren: 2,
  activeRoutes: 2,
  upcomingTrips: 4,
};

const MOCK_CHILDREN_TRANSPORT: ChildTransportInfo[] = [
  {
    id: 'student-1',
    name: 'Emma Johnson',
    grade: 'Grade 5',
    routeId: 'route-1',
    routeName: 'North District Route',
    routeStatus: 'ACTIVE',
    driverName: 'John Anderson',
    driverPhone: '+1 (555) 123-4567',
    vehicleNumber: 'BUS-001',
    pickupTime: '07:30 AM',
    dropoffTime: '03:45 PM',
    pickupLocation: '123 Oak Street',
    dropoffLocation: 'Main School Building',
  },
  {
    id: 'student-7',
    name: 'James Johnson',
    grade: 'Grade 3',
    routeId: 'route-2',
    routeName: 'South District Route',
    routeStatus: 'ACTIVE',
    driverName: 'Sarah Thompson',
    driverPhone: '+1 (555) 987-6543',
    vehicleNumber: 'BUS-002',
    pickupTime: '07:45 AM',
    dropoffTime: '04:00 PM',
    pickupLocation: '123 Oak Street',
    dropoffLocation: 'Elementary Building',
  },
];

class ParentService {
  /**
   * Fetch parent dashboard statistics
   * @returns Promise with parent dashboard stats
   */
  async fetchDashboardStats(): Promise<ParentDashboardStats> {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return MOCK_PARENT_STATS;
    }

    try {
      const response = await api.get<ParentDashboardStats>('/parent/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch parent dashboard stats:', error);
      throw error;
    }
  }

  /**
   * Fetch children transport information for the logged-in parent
   * @returns Promise with array of children transport info
   */
  async fetchChildrenTransport(): Promise<ChildTransportInfo[]> {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return MOCK_CHILDREN_TRANSPORT;
    }

    try {
      const response = await api.get<ChildTransportInfo[]>('/parent/children');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch children transport info:', error);
      throw error;
    }
  }

  /**
   * Fetch transport details for a specific child
   * @param childId - The ID of the child
   * @returns Promise with child transport info
   */
  async fetchChildTransportDetails(childId: string): Promise<ChildTransportInfo> {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const child = MOCK_CHILDREN_TRANSPORT.find(c => c.id === childId);
      if (!child) {
        throw new Error('Child not found');
      }
      return child;
    }

    try {
      const response = await api.get<ChildTransportInfo>(`/parent/children/${childId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch child transport details:', error);
      throw error;
    }
  }
}

export const parentService = new ParentService();
