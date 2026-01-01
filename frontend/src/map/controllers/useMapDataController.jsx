import { useGeolocation } from "../../hooks/useGeolocationContext";
import { useAQI } from "../../features/aqi/controllers/useAQI";
import { useWeather } from "../../features/weather/controllers/useWeather";
import { usePOIController } from "../../features/poi/hooks/usePOIController";
import { useMemo } from "react";
import { useDebouncedPosition } from "./useDebouncedPosition";

export const useMapDataController = () => {
    const geolocation = useGeolocation();
    const { getCoords } = geolocation;

    // | Check                                                                  | What it's doing                                     | Why it's needed                    |
    // | ---------------------------------------------------------------------- | --------------------------------------------------- | ---------------------------------- |
    // | `rawCoords &&`                                                         | Makes sure `rawCoords` is not `null` or `undefined` | Avoids crashes                     |
    // | `Array.isArray(rawCoords)`                                             | Makes sure it's an array                            | Coordinates should be `[lat, lng]` |
    // | `rawCoords.length === 2`                                               | Ensures there are exactly 2 items                   | Should be lat & lng only           |
    // | `typeof rawCoords[0] === 'number' && typeof rawCoords[1] === 'number'` | Makes sure both are numbers                         | Prevents invalid API calls         |
    // | `rawCoords[0] && rawCoords[1]`                                         | Makes sure neither value is `0`, `null`, or `NaN`   | Some APIs reject these             |


    const position = useMemo(() => {
        const raw = getCoords();
        if (
            raw &&
            Array.isArray(raw) &&
            raw.length === 2 &&
            typeof raw[0] === "number" &&
            typeof raw[1] === "number" &&
            raw[0] &&
            raw[1]
        ) {
            return { lat: raw[0], lng: raw[1] };
        }
        return null;
    }, [getCoords]);

    const debouncedPosition = useDebouncedPosition(position, 600);

    const aqi = useAQI({
        position: debouncedPosition
    });

    const weather = useWeather({
        position: debouncedPosition
    })

    const poi = usePOIController({
        position: debouncedPosition
    });

    const envLoading = aqi.loading || weather.loading;
    const envError = aqi.error || weather.error;

    return {
        /* ---------------- Location ---------------- */
        position,
        fetchPosition: debouncedPosition,
        setPosition: geolocation.setPosition,
        selectedPlace: geolocation.selectedPlace,
        setSelectedPlace: geolocation.setSelectedPlace,

        /* ---------------- AQI ---------------- */
        aqi: aqi.aqi,
        aqiLoading: aqi.loading,
        aqiError: aqi.error,

        /* ---------------- WEATHER ---------------- */
        weather: weather.weather,
        weatherLoading: weather.loading,
        weatherError: weather.error,

        /* ---------------- ENV STATES ---------------- */
        envLoading,
        envError,

        /* ---------------- POI ---------------- */
        poiResults: poi.poiResults,
        poiLoading: poi.loading,
        poiError: poi.error,
        poiType: poi.poiType,
        setPoiType: poi.setPoiType,
        refetchPOIs: poi.refetchPOIs,
        clearPOIs: poi.clearPOIs
    };
};
