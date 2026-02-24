import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LiveRouteTracking } from '@/types';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LiveMapProps {
  tracking: LiveRouteTracking[];
  height?: string;
}

export const LiveMap: React.FC<LiveMapProps> = ({ tracking, height = '500px' }) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current).setView([40.7128, -74.0060], 12);

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

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const markers = markersRef.current;

    // Clear existing markers
    markers.forEach(marker => marker.remove());
    markers.clear();

    // Add markers for each active route
    const bounds: L.LatLngBoundsExpression = [];
    
    tracking.forEach(route => {
      if (route.currentLocation && route.tripStatus === 'ACTIVE') {
        const { latitude, longitude } = route.currentLocation;
        const position: L.LatLngExpression = [latitude, longitude];
        bounds.push(position);

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
            <p class="text-xs text-gray-600 mb-1">Vehicle: ${route.vehicleNumber || 'N/A'}</p>
            <p class="text-xs text-gray-600 mb-1">Driver: ${route.driverName || 'N/A'}</p>
            <p class="text-xs text-gray-600 mb-1">Speed: ${route.currentLocation.speed || 0} km/h</p>
            <p class="text-xs text-gray-500">Last updated: ${new Date(route.lastUpdated).toLocaleTimeString()}</p>
          </div>
        `;
        marker.bindPopup(popupContent);

        markers.set(route.routeId, marker);
      }
    });

    // Fit map to show all markers
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [tracking]);

  return (
    <div 
      ref={mapContainerRef} 
      style={{ height, width: '100%' }} 
      className="rounded-lg overflow-hidden border border-border"
    />
  );
};
