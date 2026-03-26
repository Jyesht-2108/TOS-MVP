import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { useLiveTracking, HealthStatus } from '@/hooks/useLiveTracking';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, Bus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TripLiveMapProps {
  routeId: string;
  routeName?: string;
  vehicleNumber?: string;
  driverName?: string;
  height?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '500px',
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

const getHealthBadge = (status: HealthStatus) => {
  switch (status) {
    case 'healthy':
      return (
        <Badge variant="default" className="bg-green-500">
          <CheckCircle className="mr-1 h-3 w-3" />
          Healthy
        </Badge>
      );
    case 'warning':
      return (
        <Badge variant="default" className="bg-yellow-500">
          <Clock className="mr-1 h-3 w-3" />
          Warning
        </Badge>
      );
    case 'stale':
      return (
        <Badge variant="destructive">
          <AlertCircle className="mr-1 h-3 w-3" />
          Stale
        </Badge>
      );
  }
};

// Create a better bus icon SVG similar to the reference image
const createBusIcon = (color: string): string => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
      <!-- Outer colored ring -->
      <circle cx="24" cy="24" r="22" fill="white" stroke="${color}" stroke-width="4"/>
      <!-- Inner white circle -->
      <circle cx="24" cy="24" r="16" fill="white"/>
      <!-- Bus icon -->
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

export const TripLiveMap: React.FC<TripLiveMapProps> = ({ 
  routeId, 
  routeName, 
  vehicleNumber,
  driverName,
  height = '500px' 
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  // Use the live tracking hook with 10-second polling
  const { data, healthStatus, lastUpdated, isLoading, error } = useLiveTracking({
    routeId,
    pollingInterval: 10000,
    enabled: true,
  });

  // Center map on marker when data changes
  useEffect(() => {
    if (map && data) {
      const position = { lat: data.lat, lng: data.lng };
      console.log('[TripLiveMap] Centering map on:', position);
      map.panTo(position);
      // Set zoom to 15 for better street-level view
      if (map.getZoom()! < 15) {
        map.setZoom(15);
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
  const markerColor = healthStatus === 'healthy' ? '#22c55e' : healthStatus === 'warning' ? '#eab308' : '#ef4444';

  return (
    <div className="space-y-3">
      {/* Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="text-sm">
            <span className="font-medium">GPS Status:</span>
          </div>
          {getHealthBadge(healthStatus)}
        </div>
        <div className="text-sm text-muted-foreground">
          {data && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span>Last updated: {formatDistanceToNow(new Date(data.updated_at), { addSuffix: true })}</span>
              {isLoading && <span className="text-xs">(Updating...)</span>}
            </div>
          )}
          {!data && !error && <span>Waiting for GPS data...</span>}
        </div>
      </div>

      {/* Additional Info Bar */}
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-muted/30 rounded-lg">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Speed</p>
            <p className="text-sm font-semibold">{data.speed || 0} km/h</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Trip Type</p>
            <p className="text-sm font-semibold">{data.trip_type}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Latitude</p>
            <p className="text-sm font-semibold">{data.lat.toFixed(4)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Longitude</p>
            <p className="text-sm font-semibold">{data.lng.toFixed(4)}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">
            Failed to fetch live tracking data. Retrying automatically...
          </p>
        </div>
      )}

      {/* Google Map */}
      <div className="rounded-lg overflow-hidden border border-border" style={{ height }}>
        <GoogleMap
          mapContainerStyle={{ ...mapContainerStyle, height }}
          center={position}
          zoom={15}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={mapOptions}
        >
          {data && (
            <>
              <Marker
                position={position}
                onClick={() => {
                  console.log('[TripLiveMap] Bus marker clicked');
                  setShowInfo(true);
                }}
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
                  <div className="p-3 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <Bus className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-base">{routeName || 'Route'}</h3>
                    </div>
                    <div className="space-y-1.5 text-sm">
                      {driverName && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Driver:</span>
                          <span className="font-medium">{driverName}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vehicle:</span>
                        <span className="font-medium">{vehicleNumber || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Speed:</span>
                        <span className="font-medium">{data.speed || 0} km/h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Trip Type:</span>
                        <span className="font-medium">{data.trip_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`font-medium ${
                          healthStatus === 'healthy' ? 'text-green-600' :
                          healthStatus === 'warning' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {healthStatus.charAt(0).toUpperCase() + healthStatus.slice(1)}
                        </span>
                      </div>
                      <div className="pt-2 border-t mt-2">
                        <span className="text-xs text-gray-500">
                          Last updated: {new Date(data.updated_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </>
          )}
        </GoogleMap>
      </div>
    </div>
  );
};
