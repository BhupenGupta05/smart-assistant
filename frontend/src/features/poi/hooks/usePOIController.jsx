//behavior (when / why to fetch)

import { useCallback, useEffect, useState } from "react";
import { useGeolocation } from "../../../hooks/useGeolocationContext";
import { usePOIFetcher } from "./usePOIFetcher";

export const usePOIController = () => {
  const { getCoords } = useGeolocation();
  const { fetchPOIs, cancel } = usePOIFetcher();

  const [poiType, setPoiType] = useState(null);
  const [poiResults, setPoiResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPOIs = useCallback(async () => {
     console.log('LOAD POIS START', poiType)
    if (!poiType) return;

    const coords = getCoords();
    console.log('COORDS USED FOR POI:', coords)
    if (!coords) return;

    setLoading(true);
    setError(null);

    try {
      const [lat, lng] = coords;
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
  }, [poiType, getCoords, fetchPOIs]);

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
