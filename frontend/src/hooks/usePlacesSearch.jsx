// NOT USED ANYWHERE
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const DEBOUNCE_DELAY = 300;

export const usePlacesSearch = (query) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const cacheRef = useRef(new Map());

  useEffect(() => {
    if (!query || query.length < 3) {
      setResults([]);
      return;
    }

    const key = query.toLowerCase().trim();
    const cached = cacheRef.current.get(key);
    if (cached) {
      setResults(cached);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const url = `${import.meta.env.VITE_BASE_URL}/api/search?query=${encodeURIComponent(query)}`;
        const { data } = await axios.get(url);
        cacheRef.current.set(key, data);
        setResults(data);
      } catch (err) {
        console.error("Places search failed:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [query]);

  return { results, loading };
};
