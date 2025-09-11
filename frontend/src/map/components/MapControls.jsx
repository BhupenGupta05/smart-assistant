import POICategory from "./POICategory"
import SearchBar from "./SearchBar"
import AQIIndicator from "./AQIIndicator"
import POIDetails from "./POIDetails"
import Chatbot from "../../components/Chatbot";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";
import { useDirections } from "../../hooks/useDirections";
import SearchControls from "../controls/SearchControls";
import DirectionControls from "../controls/DirectionControls";

export const normalize = (place) => {
    if (!place) return null;

    let lat, lng;

    if (place.geometry?.location) {
        lat = typeof place.geometry.location.lat === "function"
            ? place.geometry.location.lat()
            : place.geometry.location.lat;
        lng = typeof place.geometry.location.lng === "function"
            ? place.geometry.location.lng()
            : place.geometry.location.lng;
        console.log("🌍 geometry.location detected:", lat, lng);
    } else if (Array.isArray(place.location)) {
        [lat, lng] = place.location;
        console.log("📦 array location detected:", lat, lng);
    } else if (place.lat !== undefined && place.lng !== undefined) {
        lat = place.lat;
        lng = place.lng;
        console.log("📍 direct lat/lng detected:", lat, lng);
    } else {
        console.warn("⚠️ normalize: no coordinates found in place", place);
    }

    return {
        name: place.name || place.formatted_address,
        address: place.formatted_address || place.name,
        location: [lat, lng],
        lat,
        lng,
    };
};


const MapControls = ({
    query,
    setQuery,
    origin,
    setOrigin,
    destination,
    setDestination,
    activeField,
    setActiveField,
    setPosition,
    selectedPlace,
    setSelectedPlace,
    aqi,
    aqiLoading,
    aqiError,
    poiType,
    setPoiType,
    showTransitLayer,
    setShowTransitLayer,
    searchRef,
    routes,
    getDirections,
    loading,
    error,
    mode,
    setMode,
    activeRouteIndex,
    setActiveRouteIndex
}) => {

    useEffect(() => {
        if (!selectedPlace) return;

        const normalizedPlace = normalize(selectedPlace);

        // console.log("normalizedPlace", normalizedPlace);


        if (mode === "search") {
            // Just show POI details; user will click "Directions"
        } else if (mode === "directions") {
            if (activeField === "origin") setOrigin(normalizedPlace);
            else if (activeField === "destination") setDestination(normalizedPlace);
            setActiveField(null);
        }

        setSelectedPlace(mode === "search" ? selectedPlace : null);
    }, [selectedPlace, activeField, mode, setSelectedPlace]);



    return (
        <>
            {mode === "search" && (
                <SearchControls
                    setOrigin={setOrigin}
                    setPosition={setPosition}
                    selectedPlace={selectedPlace}
                    setSelectedPlace={setSelectedPlace}
                    setDestination={setDestination}
                    setActiveField={setActiveField}
                    setMode={setMode}
                    aqi={aqi}
                    aqiLoading={aqiLoading}
                    aqiError={aqiError}
                    poiType={poiType}
                    showTransitLayer={showTransitLayer}
                    setShowTransitLayer={setShowTransitLayer}
                    searchRef={searchRef} />
            )}

            {mode === "directions" && (
                <DirectionControls
                    origin={origin}
                    setOrigin={setOrigin}
                    destination={destination}
                    setDestination={setDestination}
                    activeField={activeField}
                    setActiveField={setActiveField}
                    setPosition={setPosition}
                    selectedPlace={selectedPlace}
                    setSelectedPlace={setSelectedPlace}
                    aqi={aqi}
                    aqiLoading={aqiLoading}
                    aqiError={aqiError}
                    poiType={poiType}
                    setPoiType={setPoiType}
                    showTransitLayer={showTransitLayer}
                    setShowTransitLayer={setShowTransitLayer}
                    searchRef={searchRef}
                    routes={routes}
                    getDirections={getDirections}
                    loading={loading}
                    error={error}
                    setMode={setMode}
                    activeRouteIndex={activeRouteIndex}
                    setActiveRouteIndex={setActiveRouteIndex}
                />
            )}

        </>
    )
}

export default MapControls
