import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLiveTracking, HealthStatus } from '@/hooks/useLiveTracking';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ChildLiveMapProps {
  routeId: string;
  routeName?: string;
  vehicleNumber?: string;
  driverName?: string;
  childName?: string;
  height?: string;
}

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
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Use the live tracking hook with 10-second polling
  const { data, healthStatus, lastUpdated, isLoading, error } = useLiveTracking({
    routeId,
    pollingInterval: 10000,
    enabled: true,
  });

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

  // Update marker position when data changes
  useEffect(() => {
    if (!mapRef.current || !data) return;

    const map = mapRef.current;
    const position: L.LatLngExpression = [data.lat, data.lng];

    // Create custom bus icon
    const busIcon = L.divIcon({
      className: 'custom-bus-marker',
      html: `
        <div class="flex flex-col items-center">
          <div class="bg-primary text-primary-foreground rounded-full p-2 shadow-lg border-2 border-white">
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
            ${vehicleNumber || routeName || 'Bus'}
          </div>
        </div>
      `,
      iconSize: [60, 80],
      iconAnchor: [30, 80],
    });

    if (markerRef.current) {
      // Update existing marker position smoothly
      markerRef.current.setLatLng(position);
      markerRef.current.setIcon(busIcon);
    } else {
      // Create new marker
      markerRef.current = L.marker(position, { icon: busIcon }).addTo(map);
    }

    // Add popup with route info
    const popupContent = `
      <div class="p-2">
        <h3 class="font-semibold text-sm mb-1">${routeName || 'Route'}</h3>
        ${childName ? `<p class="text-xs text-gray-600 mb-1">Child: ${childName}</p>` : ''}
        ${driverName ? `<p class="text-xs text-gray-600 mb-1">Driver: ${driverName}</p>` : ''}
        <p class="text-xs text-gray-600 mb-1">Vehicle: ${vehicleNumber || 'N/A'}</p>
        <p class="text-xs text-gray-600 mb-1">Speed: ${data.speed || 0} km/h</p>
        <p class="text-xs text-gray-500">Last updated: ${new Date(data.updated_at).toLocaleTimeString()}</p>
      </div>
    `;
    markerRef.current.bindPopup(popupContent);

    // Center map on marker
    map.setView(position, 14);
  }, [data, routeName, vehicleNumber, driverName, childName]);

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

      {/* Map Container */}
      <div 
        ref={mapContainerRef} 
        style={{ height, width: '100%' }} 
        className="rounded-lg overflow-hidden border border-border"
      />

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
