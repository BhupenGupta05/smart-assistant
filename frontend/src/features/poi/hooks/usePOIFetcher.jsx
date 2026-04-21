import { useCallback, useRef } from "react";
import axios from "axios";
import useNetwork from "../../network/hooks/useNetwork";
import { loadCache, saveCache } from "../../offline/utils/poiCache";

const CACHE_TTL = 60_000; // 1 minute
const OFFLINE_CACHE_TTL = 10 * 60 * 1000 //10mins
const DEFAULT_RADIUS = 1500; // meters

export const usePOIFetcher = () => {
  const cacheRef = useRef(new Map());
  const abortRef = useRef(null);

  const isOnline = useNetwork();

  const fetchPOIs = useCallback(async ({ lat, lng, type, radius = DEFAULT_RADIUS }) => {
    if (!lat || !lng || !type) return [];

    // const cacheKey = `pois:${lat.toFixed(5)},${lng.toFixed(5)}-${type}`;
    const cacheKey = `pois:${lat.toFixed(3)},${lng.toFixed(3)}-${type}-${radius}`;



    // OFFLINE -> READ CACHE
    if (!isOnline) {
      console.log("📴 OFFLINE: Loading POIs from cache");
      const cached = loadCache(cacheKey, OFFLINE_CACHE_TTL)
      return cached || [];
    }

    // ONLINE -> FETCH
    const memoryCached = cacheRef.current.get(cacheKey);

    if (memoryCached) {
      const age = Date.now() - memoryCached.timestamp;

      if (age < CACHE_TTL) {
        // console.log(`⚡ Memory cache hit (${radius}m)`);
        return memoryCached.data;
      }
    }

    // Check localStorage cache as fallback
    const localStorageCached = loadCache(cacheKey, CACHE_TTL);

    if (localStorageCached) {
      console.log("💾 ONLINE: Found in localStorage, updating in background");
      cacheRef.current.set(cacheKey, {
        data: localStorageCached,
        timestamp: Date.now()
      });

      // Fetch fresh data in background
      fetchFreshData(cacheKey, lat, lng, type, radius).catch(console.error);

      return localStorageCached;
    }

    return await fetchFreshData(cacheKey, lat, lng, type, radius);
  }, [isOnline]);

  const fetchFreshData = useCallback(async (cacheKey, lat, lng, type, radius) => {
    // cancel previous request
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      console.log(`🌐 ONLINE: Fetching fresh POI data with radius ${radius}`);
      const url = `${import.meta.env.VITE_BASE_URL}/api/nearby?lat=${lat}&lng=${lng}&radius=${radius}&type=${type}`;
      const { data } = await axios.get(url, {
        signal: controller.signal,
        timeout: 10000
      });

      // save to both caches
      cacheRef.current.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      saveCache(cacheKey, data);
      console.log("💾 Data cached for offline use");

      return data;
    } catch (err) {
      // ignore abort errors
      if (err.name === "CanceledError" || err.name === "AbortError") {
        return [];
      }

      // On network error, try to serve stale cache
      const staleCache = loadCache(cacheKey, OFFLINE_CACHE_TTL * 2); //allow older data
      if (staleCache) {
        console.warn("🌐 Network error, serving stale cache", err.message);
        return staleCache;
      }
      throw err;
    } finally {
      abortRef.current = null;
    }
  }, []);

  const cancel = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  }, []);

  // Optional: Clear cache function
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
    // You could also clear localStorage entries with your prefix
  }, []);
  return { fetchPOIs, cancel };
};



