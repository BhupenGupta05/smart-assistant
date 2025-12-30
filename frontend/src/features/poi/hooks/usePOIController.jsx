//behavior (when / why to fetch)

import { useCallback, useEffect, useState } from "react";
import { usePOIFetcher } from "./usePOIFetcher";

export const usePOIController = ({ position }) => {
  const { fetchPOIs, cancel } = usePOIFetcher();

  const [poiType, setPoiType] = useState(null);
  const [poiResults, setPoiResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPOIs = useCallback(async () => {
    if (!poiType || !position) return;

    const { lat, lng } = position;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchPOIs({ lat, lng, type: poiType });
      console.log('POI FETCHED:', data);
      
      setPoiResults(data);
    } catch (err) {
      if (err.name === "CanceledError") return;
      console.error("POI fetch failed:", err);
      setPoiResults([]);
      setError("Could not fetch POIs");
    } finally {
      setLoading(false);
    }
  }, [poiType, position, fetchPOIs]);

  // Fetch when type or location changes
  useEffect(() => {
     console.log('POI EFFECT TRIGGERED:', poiType)
    loadPOIs();
    return cancel;
  }, [loadPOIs, cancel]);

  // Retry on error
  useEffect(() => {
    if (!error) return;

    const retry = setInterval(loadPOIs, 15_000);
    return () => clearInterval(retry);
  }, [error, loadPOIs]);

  return {
    poiType,
    setPoiType,
    poiResults,
    loading,
    error,
    refetchPOIs: loadPOIs,
    clearPOIs: () => setPoiResults([]),
  };
};
