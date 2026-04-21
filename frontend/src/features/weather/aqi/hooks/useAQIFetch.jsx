import { useState, useRef, useCallback } from "react";
import axios from "axios";
import useNetwork from "../../../network/hooks/useNetwork";
import { loadAQI, saveAQI } from "../../../offline/utils/aqiCache";
import { lastUpdated } from '../../../offline/utils/lastUpdated' 

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

      if (!isOnline) {
        const cachedAQI = loadAQI(lat, lon, 2 * 60 * 60 * 1000); //2h
        console.log(cachedAQI);
        
        if (cachedAQI) {
          setAqi({
            data: cachedAQI.data,
            timestamp: cachedAQI.timestamp,
            source: "cache",
            lastUpdatedText: lastUpdated(cachedAQI.timestamp)
          });
        } else {
          setAqi(null);
        }
        return;
      }

      const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;
      const now = Date.now();

      // 🟢 Serve from cache
      const memoryCached = cacheRef.current.get(key);
      if (memoryCached && now - memoryCached.timestamp < CACHE_TTL) {
        setAqi({
          data: memoryCached.data,
          timestamp: memoryCached.timestamp,
          source: "cache",
          lastUpdatedText: lastUpdated(memoryCached.timestamp)
        });
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
          setAqi({
            data: data.aqi,
            timestamp: now,
            source: "network",
            lastUpdatedText: null
          });
          cacheRef.current.set(key, {
            data: data.aqi,
            timestamp: now
          });
          saveAQI(lat, lon, data.aqi);
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
    }, [isOnline]);

  return {
    aqi,
    loading,
    error,
    fetchAQI
  };
};
