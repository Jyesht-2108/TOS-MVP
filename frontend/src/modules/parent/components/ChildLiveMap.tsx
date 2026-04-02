import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { useLiveTracking, HealthStatus } from '@/hooks/useLiveTracking';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ChildLiveMapProps {
  routeId: string;
  routeName?: string;
  vehicleNumber?: string;
  driverName?: string;
  childName?: string;
  height?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 12.9716,
  lng: 77.5946,
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
};

// Create a proper bus icon SVG (same as admin map)
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

const getHealthBadge = (status: HealthStatus) => {
  switch (status) {
    case 'healthy':
      return (
        <Badge variant="default" className="bg-green-500">
          <CheckCircle className="mr-1 h-3 w-3" />
          Live
        </Badge>
      );
    case 'warning':
      return (
        <Badge variant="default" className="bg-yellow-500">
          <Clock className="mr-1 h-3 w-3" />
          Delayed
        </Badge>
      );
    case 'stale':
      return (
        <Badge variant="secondary">
          <AlertCircle className="mr-1 h-3 w-3" />
          Offline
        </Badge>
      );
  }
};

export const ChildLiveMap: React.FC<ChildLiveMapProps> = ({ 
  routeId, 
  routeName, 
  vehicleNumber,
  driverName,
  childName,
  height = '400px' 
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  // Use the live tracking hook with 10-second polling
  const { data, healthStatus, isLoading, error } = useLiveTracking({
    routeId,
    pollingInterval: 10000,
    enabled: true,
  });

  // Center map on marker when data changes
  useEffect(() => {
    if (map && data) {
      const position = { lat: data.lat, lng: data.lng };
      map.panTo(position);
      if (map.getZoom()! < 14) {
        map.setZoom(14);
      }
    }
  }, [map, data]);

  const onLoad = React.useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(() => {
    setMap(null);
  }, []);

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

  const position = data ? { lat: data.lat, lng: data.lng } : defaultCenter;
  
  // Get marker color based on health status
  const markerColor = healthStatus === 'healthy' 
    ? '#22c55e' 
    : healthStatus === 'warning' 
    ? '#eab308' 
    : '#6b7280';

  return (
    <div className="space-y-3">
      {/* Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-medium">Live Bus Location</p>
            <p className="text-xs text-muted-foreground">Updates every 10 seconds</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getHealthBadge(healthStatus)}
          {data && (
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(data.updated_at), { addSuffix: true })}
            </span>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                Unable to load live location
              </p>
              <p className="text-xs text-amber-800 dark:text-amber-200 mt-1">
                The bus may not be active right now. We'll keep trying to connect.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* No Data Message */}
      {!data && !error && !isLoading && (
        <div className="p-3 bg-muted/50 border border-border rounded-lg">
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Waiting for GPS data...</p>
              <p className="text-xs text-muted-foreground mt-1">
                The bus location will appear here once the trip starts.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Google Map */}
      <div className="rounded-lg overflow-hidden border border-border" style={{ height }}>
        <GoogleMap
          mapContainerStyle={{ ...mapContainerStyle, height }}
          center={position}
          zoom={14}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={mapOptions}
        >
          {data && (
            <>
              <Marker
                position={position}
                onClick={() => setShowInfo(true)}
                icon={{
                  url: createBusIcon(markerColor),
                  scaledSize: new google.maps.Size(48, 48),
                  anchor: new google.maps.Point(24, 24),
                }}
              />
              {showInfo && (
                <InfoWindow
                  position={position}
                  onCloseClick={() => setShowInfo(false)}
                >
                  <div className="p-2">
                    <h3 className="font-semibold text-sm mb-1">{routeName || 'Route'}</h3>
                    {childName && <p className="text-xs text-gray-600 mb-1">Child: {childName}</p>}
                    {driverName && <p className="text-xs text-gray-600 mb-1">Driver: {driverName}</p>}
                    <p className="text-xs text-gray-600 mb-1">Vehicle: {vehicleNumber || 'N/A'}</p>
                    <p className="text-xs text-gray-600 mb-1">Speed: {data.speed || 0} km/h</p>
                    <p className="text-xs text-gray-500">Last updated: {new Date(data.updated_at).toLocaleTimeString()}</p>
                  </div>
                </InfoWindow>
              )}
            </>
          )}
        </GoogleMap>
      </div>

      {/* Additional Info */}
      {data && (
        <div className="grid grid-cols-2 gap-3 p-3 bg-muted/30 rounded-lg">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Current Speed</p>
            <p className="text-sm font-semibold">{data.speed || 0} km/h</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Trip Type</p>
            <p className="text-sm font-semibold capitalize">{data.trip_type.toLowerCase()}</p>
          </div>
        </div>
      )}
    </div>
  );
};
