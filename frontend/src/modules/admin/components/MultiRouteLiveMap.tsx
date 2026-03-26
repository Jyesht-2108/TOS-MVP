import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { trackingService, LiveTrackingResponse } from '@/services/tracking.service';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RouteInfo {
  routeId: string;
  routeName: string;
  vehicleNumber?: string;
  driverName?: string;
}

interface MultiRouteLiveMapProps {
  routes: RouteInfo[];
  height?: string;
}

type HealthStatus = 'healthy' | 'warning' | 'stale';

interface RouteTrackingData {
  data: LiveTrackingResponse;
  healthStatus: HealthStatus;
}

const calculateHealthStatus = (updatedAt: string): HealthStatus => {
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
};

export const MultiRouteLiveMap: React.FC<MultiRouteLiveMapProps> = ({ 
  routes, 
  height = '600px' 
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const [trackingData, setTrackingData] = useState<Map<string, RouteTrackingData>>(new Map());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map with Bangalore coordinates as default
    const map = L.map(mapContainerRef.current).setView([12.9716, 77.5946], 12);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Fetch tracking data for all routes
  const fetchAllTracking = React.useCallback(async () => {
    console.log('[MultiRouteLiveMap] fetchAllTracking called. Routes:', routes?.length);
    
    if (!routes || routes.length === 0) {
      console.log('[MultiRouteLiveMap] No routes to fetch');
      return;
    }

    const newTrackingData = new Map<string, RouteTrackingData>();

    await Promise.all(
      routes.map(async (route) => {
        try {
          console.log(`[MultiRouteLiveMap] Fetching tracking for route ${route.routeId}`);
          const data = await trackingService.fetchLiveTracking(route.routeId);
          console.log(`[MultiRouteLiveMap] Got data for ${route.routeId}:`, data);
          const healthStatus = calculateHealthStatus(data.updated_at);
          console.log(`[MultiRouteLiveMap] Health status for ${route.routeId}:`, healthStatus);
          newTrackingData.set(route.routeId, { data, healthStatus });
          console.log(`[MultiRouteLiveMap] Added to map. Map size now:`, newTrackingData.size);
        } catch (error) {
          console.error(`Failed to fetch tracking for route ${route.routeId}:`, error);
        }
      })
    );

    console.log('[MultiRouteLiveMap] All fetches complete. Total tracking data:', newTrackingData.size);

    console.log('[MultiRouteLiveMap] Setting tracking data state');
    setTrackingData(newTrackingData);
  }, [routes]);

  // Initial fetch
  useEffect(() => {
    if (routes && routes.length > 0) {
      fetchAllTracking();
    }
  }, [routes, fetchAllTracking]);

  // Set up polling interval
  useEffect(() => {
    if (!routes || routes.length === 0) return;

    intervalRef.current = setInterval(() => {
      fetchAllTracking();
    }, 10000); // Poll every 10 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [routes, fetchAllTracking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Update markers when tracking data changes
  useEffect(() => {
    console.log('[MultiRouteLiveMap] Marker update effect triggered. Map:', !!mapRef.current, 'Tracking data size:', trackingData.size);
    
    if (!mapRef.current || trackingData.size === 0) {
      console.log('[MultiRouteLiveMap] Skipping marker update - no map or no tracking data');
      return;
    }

    console.log('[MultiRouteLiveMap] Creating markers for', trackingData.size, 'routes');

    const map = mapRef.current;
    const markers = markersRef.current;
    const bounds: L.LatLngBoundsExpression = [];

    // Clear existing markers
    markers.forEach(marker => marker.remove());
    markers.clear();

    // Add markers for each route
    trackingData.forEach((tracking, routeId) => {
      const route = routes.find(r => r.routeId === routeId);
      if (!route) {
        console.log('[MultiRouteLiveMap] Route not found for', routeId);
        return;
      }

      const position: L.LatLngExpression = [tracking.data.lat, tracking.data.lng];
      console.log(`[MultiRouteLiveMap] Adding marker for ${route.routeName} at`, position);
      bounds.push(position);

      // Determine marker color based on health status
      const healthColor = tracking.healthStatus === 'healthy' 
        ? 'bg-green-600' 
        : tracking.healthStatus === 'warning' 
        ? 'bg-yellow-600' 
        : 'bg-red-600';

      // Create custom bus icon
      const busIcon = L.divIcon({
        className: 'custom-bus-marker',
        html: `
          <div class="flex flex-col items-center">
            <div class="${healthColor} text-white rounded-full p-2 shadow-lg border-2 border-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 6v6"/>
                <path d="M15 6v6"/>
                <path d="M2 12h19.6"/>
                <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/>
                <circle cx="7" cy="18" r="2"/>
                <path d="M9 18h5"/>
                <circle cx="16" cy="18" r="2"/>
              </svg>
            </div>
            <div class="bg-white px-2 py-1 rounded shadow-md text-xs font-semibold mt-1 whitespace-nowrap border border-gray-200">
              ${route.vehicleNumber || route.routeName}
            </div>
          </div>
        `,
        iconSize: [60, 80],
        iconAnchor: [30, 80],
      });

      const marker = L.marker(position, { icon: busIcon }).addTo(map);

      // Add popup with route info
      const popupContent = `
        <div class="p-2">
          <h3 class="font-semibold text-sm mb-1">${route.routeName}</h3>
          ${route.driverName ? `<p class="text-xs text-gray-600 mb-1">Driver: ${route.driverName}</p>` : ''}
          <p class="text-xs text-gray-600 mb-1">Vehicle: ${route.vehicleNumber || 'N/A'}</p>
          <p class="text-xs text-gray-600 mb-1">Speed: ${tracking.data.speed || 0} km/h</p>
          <p class="text-xs text-gray-600 mb-1">Trip Type: ${tracking.data.trip_type}</p>
          <p class="text-xs text-gray-500">Last updated: ${new Date(tracking.data.updated_at).toLocaleTimeString()}</p>
        </div>
      `;
      marker.bindPopup(popupContent);

      markers.set(routeId, marker);
    });

    console.log('[MultiRouteLiveMap] Created', markers.size, 'markers. Bounds:', bounds);

    // Fit map to show all markers
    if (bounds.length > 0) {
      console.log('[MultiRouteLiveMap] Fitting map to bounds');
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [trackingData, routes]);

  // Calculate overall health statistics
  const healthStats = useMemo(() => {
    let healthy = 0;
    let warning = 0;
    let stale = 0;

    trackingData.forEach((tracking) => {
      if (tracking.healthStatus === 'healthy') healthy++;
      else if (tracking.healthStatus === 'warning') warning++;
      else stale++;
    });

    return { healthy, warning, stale };
  }, [trackingData]);

  return (
    <div className="space-y-3">
      {/* Status Bar */}
      {trackingData.size > 0 && (
        <div className="flex flex-wrap items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <div className="text-sm font-medium">GPS Health:</div>
          {healthStats.healthy > 0 && (
            <Badge variant="default" className="bg-green-500">
              <CheckCircle className="mr-1 h-3 w-3" />
              {healthStats.healthy} Healthy
            </Badge>
          )}
          {healthStats.warning > 0 && (
            <Badge variant="default" className="bg-yellow-500">
              <Clock className="mr-1 h-3 w-3" />
              {healthStats.warning} Warning
            </Badge>
          )}
          {healthStats.stale > 0 && (
            <Badge variant="destructive">
              <AlertCircle className="mr-1 h-3 w-3" />
              {healthStats.stale} Stale
            </Badge>
          )}
          <div className="ml-auto text-xs text-muted-foreground">
            Tracking {trackingData.size} of {routes.length} routes
          </div>
        </div>
      )}

      {/* Map Container */}
      <div 
        ref={mapContainerRef} 
        style={{ height, width: '100%' }} 
        className="rounded-lg overflow-hidden border border-border"
      />

      {routes.length === 0 && (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            No active routes to display
          </p>
        </div>
      )}
    </div>
  );
};
