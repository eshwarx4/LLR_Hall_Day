"use client";

import { useState, useCallback } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
  permissionDenied: boolean;
  unsupported: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
    permissionDenied: false,
    unsupported: false,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((s) => ({
        ...s,
        unsupported: true,
        error: "Geolocation is not supported by your browser",
      }));
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
          permissionDenied: false,
          unsupported: false,
        });
      },
      (error) => {
        const permissionDenied = error.code === error.PERMISSION_DENIED;
        setState({
          latitude: null,
          longitude: null,
          error: permissionDenied
            ? "Location permission denied"
            : "Could not get your location",
          loading: false,
          permissionDenied,
          unsupported: false,
        });
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  return { ...state, requestLocation };
}
