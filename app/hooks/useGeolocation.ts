'use client';

import { useState, useEffect, useCallback } from 'react';
import { DEFAULT_CENTER, TRACKING_INTERVAL_MS } from '@/app/lib/constants';

interface UseGeolocationReturn {
  location: [number, number];
  isTracking: boolean;
  lastUpdated: string;
  startTracking: () => void;
  stopTracking: () => void;
  toggleTracking: () => void;
}

export function useGeolocation(): UseGeolocationReturn {
  const [location, setLocation] = useState<[number, number]>(DEFAULT_CENTER);
  const [isTracking, setIsTracking] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchLocation = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation: [number, number] = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setLocation(newLocation);
          setLastUpdated(`Diperbarui pada ${new Date().toLocaleTimeString()}`);
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (!isTracking) return;

    fetchLocation();
    const intervalId = setInterval(fetchLocation, TRACKING_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [isTracking, fetchLocation]);

  const startTracking = useCallback(() => setIsTracking(true), []);
  const stopTracking = useCallback(() => setIsTracking(false), []);
  const toggleTracking = useCallback(() => setIsTracking((prev) => !prev), []);

  return {
    location,
    isTracking,
    lastUpdated,
    startTracking,
    stopTracking,
    toggleTracking,
  };
}
