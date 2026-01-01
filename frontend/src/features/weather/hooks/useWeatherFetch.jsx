import { useState, useRef, useCallback } from "react";
import axios from "axios";

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export const useWeatherFetch = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cacheRef = useRef(new Map());

  const fetchWeather = useCallback(
    async (lat, lon, signal) => {
      if (!lat || !lon) return;

      const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;
      const now = Date.now();

      // 🟢 Serve from cache
      const cached = cacheRef.current.get(key);
      if (cached && now - cached.timestamp < CACHE_TTL) {
        setWeather(cached.data);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/weather`,
          {
            params: { lat, lon },
            signal
          }
        );

        if (data?.weather !== undefined) {
          setWeather(data.weather);
          cacheRef.current.set(key, {
            data: data.weather,
            timestamp: now
          });
        } else {
          throw new Error("Invalid weather data");
        }
      } catch (err) {
        if (err.name === "CanceledError") return;
        setError(err);
        setWeather(null);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    weather,
    loading,
    error,
    fetchWeather
  };
};
