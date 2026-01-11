//pure data (API, cache, abort)

// pure data (API, cache, abort)

import { useCallback, useRef } from "react";
import axios from "axios";
import useNetwork from "../../network/hooks/useNetwork";

const CACHE_TTL = 60_000; // 1 minute

export const usePOIFetcher = () => {
  const cacheRef = useRef(new Map());
  const abortRef = useRef(null);

  const isOnline = useNetwork();


  const fetchPOIs = useCallback(async ({ lat, lng, type }) => {
    if (!lat || !lng || !type) return [];

    if (!isOnline) {
        return [];
      }

    const cacheKey = `${lat.toFixed(5)},${lng.toFixed(5)}-${type}`;
    const cached = cacheRef.current.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    // cancel previous request
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const url = `${import.meta.env.VITE_BASE_URL}/api/nearby?lat=${lat}&lng=${lng}&radius=1500&type=${type}`;
      const { data } = await axios.get(url, {
        signal: controller.signal,
      });

      cacheRef.current.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      return data;
    } catch (err) {
      // ignore abort errors
      if (err.name === "CanceledError" || err.name === "AbortError") {
        return [];
      }
      throw err;
    }
  }, []);

  const cancel = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  }, []);

  return { fetchPOIs, cancel };
};
