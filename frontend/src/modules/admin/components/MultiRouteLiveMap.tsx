import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { trackingService, LiveTrackingResponse } from '@/services/tracking.service';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, Bus } from 'lucide-react';

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

const mapContainerStyle = {
  width: '100%',
  height: '600px',
};

const defaultCenter = {
  lat: 12.9862666,
  lng: 77.7172536,
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
};

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

// Create a better bus icon SVG
const createBusIcon = (color: string): string => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="22" fill="white" stroke="${color}" stroke-width="4"/>
      <circle cx="24" cy="24" r="16" fill="white"/>
      <g transform="translate(24, 24)">
        <path d="M-8,-6 L8,-6 L8,6 L-8,6 Z" fill="${color}" stroke="${color}" stroke-width="1.5" stroke-linejoin="round"/>
        <rect x="-7" y="-5" width="6" height="5" fill="white" rx="0.5"/>
        <rect x="1" y="-5" width="6" height="5" fill="white" rx="0.5"/>
        <rect x="-7" y="1" width="14" height="3" fill="white" rx="0.5"/>
        <circle cx="-4" cy="7" r="1.5" fill="#333"/>
        <circle cx="4" cy="7" r="1.5" fill="#333"/>
        <line x1="-8" y1="-2" x2="8" y2="-2" stroke="white" stroke-width="1"/>
      </g>
    </svg>
  `;
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
};

export const MultiRouteLiveMap: React.FC<MultiRouteLiveMapProps> = ({ 
  routes, 
  height = '600px' 
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [trackingData, setTrackingData] = useState<Map<string, RouteTrackingData>>(new Map());
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  // Fetch tracking data for all routes
  const fetchAllTracking = useCallback(async () => {
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
          
          // Safety check: ensure data is valid
          if (!data || !data.updated_at) {
            console.error(`Invalid tracking data for route ${route.routeId}:`, data);
            return;
          }
          
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
    console.log('[MultiRouteLiveMap] Setting tracking data state with new Map instance');
    // Create a new Map instance to ensure React detects the change
    setTrackingData(new Map(newTrackingData));
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

  // Fit map bounds when tracking data changes
  useEffect(() => {
    if (map && trackingData.size > 0) {
      console.log('[MultiRouteLiveMap] Fitting bounds for', trackingData.size, 'markers');
      const bounds = new google.maps.LatLngBounds();
      let markerCount = 0;
      
      trackingData.forEach((tracking) => {
        const position = { lat: tracking.data.lat, lng: tracking.data.lng };
        console.log('[MultiRouteLiveMap] Extending bounds with:', position);
        bounds.extend(position);
        markerCount++;
      });
      
      if (markerCount === 1) {
        // If only one marker, center on it and set a reasonable zoom
        const singlePosition = Array.from(trackingData.values())[0].data;
        console.log('[MultiRouteLiveMap] Single marker - centering at:', singlePosition);
        map.setCenter({ lat: singlePosition.lat, lng: singlePosition.lng });
        map.setZoom(15);
      } else {
        // Multiple markers - fit bounds with padding
        console.log('[MultiRouteLiveMap] Multiple markers - fitting bounds');
        map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
      }
    }
  }, [map, trackingData]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

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

  if (loadError) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
        <p className="text-sm text-destructive">
          Failed to load Google Maps. Please check your API key and internet connection.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-12 bg-muted/30 rounded-lg" style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

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

      {/* Google Map */}
      <div className="rounded-lg overflow-hidden border border-border" style={{ height }}>
        <GoogleMap
          mapContainerStyle={{ ...mapContainerStyle, height }}
          center={defaultCenter}
          zoom={15}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={mapOptions}
        >
          {(() => {
            const entries = Array.from(trackingData.entries());
            console.log('[MultiRouteLiveMap] Rendering markers. Entries count:', entries.length);
            
            return entries.map(([routeId, tracking]) => {
              const route = routes.find(r => r.routeId === routeId);
              console.log(`[MultiRouteLiveMap] Processing marker for ${routeId}. Route found:`, !!route);
              
              if (!route) {
                console.log(`[MultiRouteLiveMap] Skipping ${routeId} - route not found`);
                return null;
              }

              const position = { lat: tracking.data.lat, lng: tracking.data.lng };
              const markerColor = tracking.healthStatus === 'healthy' 
                ? '#22c55e' 
                : tracking.healthStatus === 'warning' 
                ? '#eab308' 
                : '#ef4444';

              console.log(`[MultiRouteLiveMap] Rendering marker for ${routeId} at`, position, 'color:', markerColor);

              return (
                <React.Fragment key={routeId}>
                  <Marker
                    position={position}
                    onClick={() => {
                      console.log(`[MultiRouteLiveMap] Marker clicked for ${routeId}`);
                      setSelectedRoute(routeId);
                    }}
                    icon={{
                      url: createBusIcon(markerColor),
                      scaledSize: new google.maps.Size(48, 48),
                      anchor: new google.maps.Point(24, 48),
                    }}
                  />
                  {selectedRoute === routeId && (
                    <InfoWindow
                      position={position}
                      onCloseClick={() => setSelectedRoute(null)}
                    >
                      <div className="p-3 min-w-[200px]">
                        <div className="flex items-center gap-2 mb-2">
                          <Bus className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold text-base">{route.routeName}</h3>
                        </div>
                        <div className="space-y-1.5 text-sm">
                          {route.driverName && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Driver:</span>
                              <span className="font-medium">{route.driverName}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600">Vehicle:</span>
                            <span className="font-medium">{route.vehicleNumber || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Speed:</span>
                            <span className="font-medium">{tracking.data.speed || 0} km/h</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Trip Type:</span>
                            <span className="font-medium">{tracking.data.trip_type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className={`font-medium ${
                              tracking.healthStatus === 'healthy' ? 'text-green-600' :
                              tracking.healthStatus === 'warning' ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {tracking.healthStatus.charAt(0).toUpperCase() + tracking.healthStatus.slice(1)}
                            </span>
                          </div>
                          <div className="pt-2 border-t mt-2">
                            <span className="text-xs text-gray-500">
                              Last updated: {new Date(tracking.data.updated_at).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </InfoWindow>
                  )}
                </React.Fragment>
              );
            });
          })()}
        </GoogleMap>
      </div>

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
