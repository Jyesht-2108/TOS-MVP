import React from 'react';
import { LoadScript } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

interface GoogleMapsLoaderProps {
  children: React.ReactNode;
}

export const GoogleMapsLoader: React.FC<GoogleMapsLoaderProps> = ({ children }) => {
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
        <p className="text-sm text-destructive">
          Google Maps API key is not configured. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.
        </p>
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} loadingElement={<div>Loading Maps...</div>}>
      {children}
    </LoadScript>
  );
};
