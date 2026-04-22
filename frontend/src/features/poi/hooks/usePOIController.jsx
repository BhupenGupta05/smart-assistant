//behavior (when / why to fetch)

import { useCallback, useEffect, useState } from "react";
import { usePOIFetcher } from "./usePOIFetcher";

const DEFAULT_RADIUS = 1500; // Default search radius in meters

export const usePOIController = ({ position, poiIntent }) => {
  const { fetchPOIs, cancel } = usePOIFetcher();

  const [poiType, setPoiType] = useState(null);
  const [poiResults, setPoiResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const radius = poiIntent?.radius || DEFAULT_RADIUS;

  useEffect(() => {
    if (!poiIntent?.type) return;
    setPoiType(poiIntent.type);
  }, [poiIntent]);

  const loadPOIs = useCallback(async () => {
     console.log("FETCH CHECK:", { poiType, position });

    if (!poiType || !position) return;

    const { lat, lng } = position;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchPOIs({ lat, lng, type: poiType, radius });

      setPoiResults(data);
    } catch (err) {
      if (err.name === "CanceledError") return;
      console.error("POI fetch failed:", err);
      setPoiResults([]);
      setError("Could not fetch POIs");
    } finally {
      setLoading(false);
    }
  }, [poiType, position, radius, fetchPOIs]);

  // Fetch when type or location changes
  useEffect(() => {
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
