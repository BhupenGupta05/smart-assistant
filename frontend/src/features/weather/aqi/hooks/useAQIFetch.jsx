import { useState, useRef, useCallback } from "react";
import axios from "axios";
import useNetwork from "../../../network/hooks/useNetwork";

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export const useAQIFetch = () => {
  const [aqi, setAqi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isOnline = useNetwork();

  const cacheRef = useRef(new Map());

  const fetchAQI = useCallback(
    async (lat, lon, signal) => {
      if (!lat || !lon) return;

      if(!isOnline) {
        setLoading(false);
        return;
      }

      const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;
      const now = Date.now();

      // 🟢 Serve from cache
      const cached = cacheRef.current.get(key);
      if (cached && now - cached.timestamp < CACHE_TTL) {
        setAqi(cached.data);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/aqi`,
          {
            params: { lat, lon },
            signal
          }
        );
        
        if (data?.aqi !== undefined) {
          setAqi(data.aqi);
          cacheRef.current.set(key, {
            data: data.aqi,
            timestamp: now
          });
        } else {
          throw new Error("Invalid AQI data");
        }
      } catch (err) {
        if (err.name === "CanceledError") return;
        setError(err);
        setAqi(null);
      } finally {
        setLoading(false);
      }
    },[isOnline]);

  return {
    aqi,
    loading,
    error,
    fetchAQI
  };
};
