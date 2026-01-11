// Custom hook to fetch directions between two points using various modes of transportation

import { useCallback, useState, useRef } from "react";
import axios from "axios";
import useNetwork from "../../network/hooks/useNetwork";

//HELPER
const normalizeCoords = (point) => {
  if (!point) return null;

  if (Array.isArray(point)) return point;

  if (point.location && Array.isArray(point.location)) {
    return point.location;
  }

  if (typeof point.lat === "number" && typeof point.lng === "number") {
    return [point.lat, point.lng];
  }

  return null;
};


export const useDirections = () => {
  const [routes, setRoutes] = useState([]); // Store routes for every pair of origin and destination
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const abortRef = useRef(null);
  const isOnline = useNetwork();

  // Clear routes and errors
  const clearRoutes = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setRoutes([]);
    setError(null);
    setLoading(false);
  }, []);

  // Fetch directions between origin and destination
  const getDirections = useCallback(async (origin, destination, modes = ["driving", "walking", "transit"]) => {
    const originCoords = normalizeCoords(origin);
    const destCoords = normalizeCoords(destination);

    if (!originCoords || !destCoords) {
      console.error("Invalid coordinates:", { origin, destination });
      setRoutes([]);
      setError("Invalid origin or destination");
      setLoading(false);
      return;
    }

    if (!isOnline) {
      setError("You are offline");
      setRoutes([]);
      setLoading(false);
      return;
    }

    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const qs = new URLSearchParams({
        origin: originCoords.join(","),
        destination: destCoords.join(","),
        modes: modes.join(","),
      });

      const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/directions?${qs}`, { signal: controller.signal });
      setRoutes(data.routes || []);
      setError(null);
    } catch (e) {
      if (e.name === "CanceledError" || e.name === "AbortError") return;
      setRoutes([]);
      setError("Could not fetch directions");
    } finally {
      setLoading(false);
    }
  }, [isOnline]);

  return { routes, getDirections, clearRoutes, loading, error };
};
