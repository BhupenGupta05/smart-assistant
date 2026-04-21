import { useState, useRef, useCallback } from "react";
import axios from "axios";
import useNetwork from "../../network/hooks/useNetwork";
import { loadWeather, saveWeather } from "../../offline/utils/weatherCache";

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export const useWeatherFetch = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isOnline = useNetwork();

  const cacheRef = useRef(new Map());

  const fetchWeather = useCallback(
    async (lat, lon, signal) => {
      if (!lat || !lon) return;

      if (!isOnline) {
        const cached = loadWeather(lat, lon, CACHE_TTL);

        if (cached) {
          setWeather(cached.data);
        } else {
          setWeather(null);
        }
        setLoading(false);
        return;
      }

      const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;
      const now = Date.now();

      // Serve from cache
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

          saveWeather(lat, lon, data.weather);
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
    }, [isOnline]);

  return {
    weather,
    loading,
    error,
    fetchWeather
  };
};
