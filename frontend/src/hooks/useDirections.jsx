// Custom hook to fetch directions between two points using various modes of transportation

import { useCallback, useState } from "react";
import axios from "axios";

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
    if (!origin || !destination) {
      setRoutes([]);
      return;
    }

    console.log("GETTING DIRECTIONS FROM HOOK:", { origin, destination });

    let originCoords, destCoords;

    // 🧭 STEP 1: Handle "current" keyword for origin
    if (origin === "current") {
      try {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (p) => resolve([p.coords.latitude, p.coords.longitude]),
            (err) => reject(err)
          );
        });
        originCoords = pos;
        console.log("📍 Browser current location:", originCoords);
      } catch (geoError) {
        console.error("Failed to get current location:", geoError);
        setError("Unable to access your location");
        return;
      }
    }
    // 🧩 Handle other origin formats
    else if (Array.isArray(origin)) {
      originCoords = origin;
    } else if (origin.location) {
      originCoords = origin.location;
    } else if (origin.lat !== undefined && origin.lng !== undefined) {
      originCoords = [origin.lat, origin.lng];
    } else {
      console.error("Invalid origin format:", origin);
      setError("Invalid origin coordinates");
      return;
    }

    // ✅ Handle destination formats
    if (Array.isArray(destination)) {
      destCoords = destination;
    } else if (destination.location) {
      destCoords = destination.location;
    } else if (destination.lat !== undefined && destination.lng !== undefined) {
      destCoords = [destination.lat, destination.lng];
    } else {
      console.error("Invalid destination format:", destination);
      setError("Invalid destination coordinates");
      return;
    }

    // 🧮 Validate coordinates
    if (
      !Array.isArray(originCoords) ||
      !Array.isArray(destCoords) ||
      originCoords.length !== 2 ||
      destCoords.length !== 2 ||
      typeof originCoords[0] !== "number" ||
      typeof originCoords[1] !== "number" ||
      typeof destCoords[0] !== "number" ||
      typeof destCoords[1] !== "number"
    ) {
      console.error("Invalid coordinate format:", { originCoords, destCoords });
      setError("Invalid coordinate format");
      return;
    }

    console.log("🧭 Getting directions:", { originCoords, destCoords });

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
