const WEATHER_CACHE_KEY = "weather_cache_v1";

/**
 * Normalize location into a bucket
 * ~1km precision (good for 3–7km assumption)
 */
const getWeatherKey = (lat, lng) =>
  `${lat.toFixed(2)},${lng.toFixed(2)}`;

export const saveWeather = (lat, lng, weather) => {
  try {
    const key = getWeatherKey(lat, lng);
    const raw = localStorage.getItem(WEATHER_CACHE_KEY);
    const cache = raw ? JSON.parse(raw) : {};

    cache[key] = {
      data: weather,
      timestamp: Date.now(),
    };

    localStorage.setItem(
      WEATHER_CACHE_KEY,
      JSON.stringify(cache)
    );
  } catch (err) {
    console.warn("Weather cache save failed", err);
  }
};

export const loadWeather = (lat, lng, maxAge) => {
  try {
    const key = getWeatherKey(lat, lng);
    const raw = localStorage.getItem(WEATHER_CACHE_KEY);
    if (!raw) return null;

    const cache = JSON.parse(raw);
    const entry = cache[key];
    if (!entry) return null;

    if (Date.now() - entry.timestamp > maxAge) {
      return null;
    }

    return entry;
  } catch (err) {
    console.warn("Weather cache load failed", err);
    return null;
  }
};
