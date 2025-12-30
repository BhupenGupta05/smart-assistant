// Custom hook to fetch directions between two points using various modes of transportation

import { useCallback, useState } from "react";
import axios from "axios";

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

  // Clear routes and errors
  const clearRoutes = useCallback(() => {
    setRoutes([]);
    setError(null);
  }, []);

  // Fetch directions between origin and destination
  const getDirections = useCallback(async (origin, destination, modes = ["driving", "walking", "transit"]) => {
    const originCoords = normalizeCoords(origin);
    const destCoords = normalizeCoords(destination);

    if (!origin || !destination) {
       console.error("Invalid coordinates:", { origin, destination });
      setRoutes([]);
       setError("Invalid origin or destination");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const qs = new URLSearchParams({
        origin: originCoords.join(","),
        destination: destCoords.join(","),
        modes: modes.join(","),
      });

      const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/directions?${qs}`);
      console.log("📍 Routes received:", data.routes);
      setRoutes(data.routes || []);
      setError(null);
    } catch (e) {
      console.error("Directions fetch failed:", e.message);
      setRoutes([]);
      setError("Could not fetch directions");
    } finally {
      setLoading(false);
    }
  }, []);

  return { routes, getDirections, clearRoutes, loading, error };
};
