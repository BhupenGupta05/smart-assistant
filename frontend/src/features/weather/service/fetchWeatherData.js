import axios from "axios";
import { loadWeather, saveWeather } from "../../offline/utils/weatherCache";

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export async function fetchWeatherData({
    lat,
    lon,
    signal,
    isOnline,
    cacheRef
}) {
    if (!lat || !lon) return;

    if (!isOnline) {
        const cached = loadWeather(lat, lon, CACHE_TTL);

        return cached?.data || null;
    }

    const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;
    const now = Date.now();

    // Serve from cache
    const cached = cacheRef.current.get(key);
    if (cached && now - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }



    const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/weather`,
        {
            params: { lat, lon },
            signal
        }
    );

    if (data?.weather !== undefined) {

        cacheRef.current.set(key, {
            data: data.weather,
            timestamp: now
        });

        saveWeather(lat, lon, data.weather);
        return data.weather
    } else {
        throw new Error("Invalid weather data");
    }
}