import { useState, useEffect, useCallback, useRef } from 'react';
import { trackingService, LiveTrackingResponse } from '@/services/tracking.service';

export type HealthStatus = 'healthy' | 'warning' | 'stale';

export interface LiveTrackingState {
  data: LiveTrackingResponse | null;
  healthStatus: HealthStatus;
  lastUpdated: Date | null;
  isLoading: boolean;
  error: Error | null;
}

interface UseLiveTrackingOptions {
  routeId: string | null;
  pollingInterval?: number; // in milliseconds, default 10000 (10 seconds)
  enabled?: boolean;
}

export const useLiveTracking = ({
  routeId,
  pollingInterval = 10000,
  enabled = true,
}: UseLiveTrackingOptions): LiveTrackingState => {
  const [state, setState] = useState<LiveTrackingState>({
    data: null,
    healthStatus: 'stale',
    lastUpdated: null,
    isLoading: false,
    error: null,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  
  // Reset mounted flag on mount
  useEffect(() => {
    console.log('[useLiveTracking] Component mounted, setting isMountedRef to true');
    isMountedRef.current = true;
    
    return () => {
      console.log('[useLiveTracking] Component unmounting, setting isMountedRef to false');
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const calculateHealthStatus = useCallback((updatedAt: string): HealthStatus => {
    const now = new Date().getTime();
    const updateTime = new Date(updatedAt).getTime();
    const delayInSeconds = (now - updateTime) / 1000;

    if (delayInSeconds < 30) {
      return 'healthy';
    } else if (delayInSeconds < 90) {
      return 'warning';
    } else {
      return 'stale';
    }
  }, []);

  const fetchTracking = useCallback(async () => {
    if (!routeId || !enabled) {
      console.log('[useLiveTracking] Skipping fetch - routeId:', routeId, 'enabled:', enabled);
      return;
    }

    try {
      console.log('[useLiveTracking] Starting fetch for route:', routeId);
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const data = await trackingService.fetchLiveTracking(routeId);
      console.log('[useLiveTracking] Fetch successful, data:', data);
      
      if (!isMountedRef.current) {
        console.log('[useLiveTracking] Component unmounted, skipping state update');
        return;
      }

      const healthStatus = calculateHealthStatus(data.updated_at);
      console.log('[useLiveTracking] Setting state with data:', data, 'healthStatus:', healthStatus);
      
      setState({
        data,
        healthStatus,
        lastUpdated: new Date(),
        isLoading: false,
        error: null,
      });
      
      console.log('[useLiveTracking] State updated successfully');
    } catch (error) {
      console.error('[useLiveTracking] Fetch failed:', error);
      if (!isMountedRef.current) return;
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error as Error,
      }));
    }
  }, [routeId, enabled, calculateHealthStatus]);

  // Initial fetch
  useEffect(() => {
    if (routeId && enabled) {
      fetchTracking();
    }
  }, [routeId, enabled, fetchTracking]);

  // Set up polling interval
  useEffect(() => {
    if (!routeId || !enabled) {
      return;
    }

    intervalRef.current = setInterval(() => {
      fetchTracking();
    }, pollingInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [routeId, enabled, pollingInterval, fetchTracking]);

  // Update health status periodically based on existing data
  useEffect(() => {
    if (!state.data) return;

    const healthCheckInterval = setInterval(() => {
      if (state.data) {
        const newHealthStatus = calculateHealthStatus(state.data.updated_at);
        if (newHealthStatus !== state.healthStatus) {
          setState(prev => ({ ...prev, healthStatus: newHealthStatus }));
        }
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(healthCheckInterval);
  }, [state.data, state.healthStatus, calculateHealthStatus]);

  return state;
};
