import api from '@/lib/api';

// Check if we should use mock data
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export interface LiveTrackingResponse {
  lat: number;
  lng: number;
  updated_at: string;
  trip_id: string;
  trip_type: 'MORNING' | 'EVENING';
  speed?: number;
  heading?: number;
}

class TrackingService {
  /**
   * Fetch live GPS coordinates for a specific route
   * @param routeId - The route ID to track
   * @returns Promise with live tracking data
   */
  async fetchLiveTracking(routeId: string): Promise<LiveTrackingResponse> {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Generate mock GPS data around Bangalore with slight variations
      const baseLatitude = 12.9716;
      const baseLongitude = 77.5946;
      const variation = 0.01;
      
      return {
        lat: baseLatitude + (Math.random() - 0.5) * variation,
        lng: baseLongitude + (Math.random() - 0.5) * variation,
        updated_at: new Date().toISOString(),
        trip_id: `trip-${routeId}`,
        trip_type: new Date().getHours() < 12 ? 'MORNING' : 'EVENING',
        speed: Math.floor(Math.random() * 40) + 10,
        heading: Math.floor(Math.random() * 360),
      };
    }

    try {
      console.log(`[TrackingService] Fetching tracking for route: ${routeId}`);
      const response = await api.get<LiveTrackingResponse>('/tracking/live', {
        params: { route_id: routeId }
      });
      console.log(`[TrackingService] Response for ${routeId}:`, response.data);
      // API interceptor already unwraps the response, so just return response.data
      return response.data;
    } catch (error) {
      console.error(`[TrackingService] Failed to fetch live tracking for ${routeId}:`, error);
      throw error;
    }
  }
}

export const trackingService = new TrackingService();
