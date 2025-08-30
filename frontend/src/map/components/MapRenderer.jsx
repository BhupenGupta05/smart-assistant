import { useMemo } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import FlyToLocation from '../FlyToLocation'
import Recenter from './Recenter'
import POIMarker from './POIMarker'
import "leaflet/dist/leaflet.css";
import { userIcon, transitIcon, poiIcon, highlightedPoiIcon } from '../icons/markers'

const MapRenderer = ({
    mapRef,
    position,
    selectedPlace,
    poiResults,
    activePOIId,
    setHoverPOIId,
    setSelectedPlace,
    poiType,
    showTransitLayer,
    tileUrl,
    setPosition
}) => {

    // MEMOIZE ALL POI MARKERS
    const memoizedPOIMarkers = useMemo(() => {
        return poiResults.map((poi, idx) => {
           
            const poiId = poi.place_id || idx;
            const isActive = activePOIId === poiId;

            const icon = poiType === 'transit_station'
                ? transitIcon
                : (isActive ? highlightedPoiIcon : poiIcon);

            // Safe lat/lng access
            // const lat = poi.lat ?? poi.geometry?.location?.lat
            // const lng = poi.lng ?? poi.geometry?.location?.lng

            const lat =
                poi.lat ??
                (typeof poi.geometry?.location?.lat === "function"
                    ? poi.geometry.location.lat()
                    : poi.geometry?.location?.lat);

            const lng =
                poi.lng ??
                (typeof poi.geometry?.location?.lng === "function"
                    ? poi.geometry.location.lng()
                    : poi.geometry?.location?.lng);

            if (lat == null || lng == null) return null;

            return (
                <POIMarker
                    key={poiId}
                    poi={{ ...poi, lat, lng }}
                    poiId={poiId}
                    icon={icon}
                    onMouseOver={(id) => setHoverPOIId(id)}
                    onMouseOut={() => {
                        if (!selectedPlace || selectedPlace.place_id !== poiId) {
                            setHoverPOIId(null);
                        }
                    }}
                    onClick={(poi) => {
                        setSelectedPlace(poi);
                        setHoverPOIId(null);
                    }}
                />
            )
        })
    }, [poiResults, activePOIId, poiType, selectedPlace])

    // Safe selectedPlace coords
    const selectedLat = selectedPlace?.lat ?? selectedPlace?.geometry?.location?.lat
    const selectedLng = selectedPlace?.lng ?? selectedPlace?.geometry?.location?.lng

    // Safe map center
    // const centerPosition = position ?? [selectedLat, selectedLng]

    const centerPosition = useMemo(() => {
        if (position) return position;
        if (selectedLat != null && selectedLng != null) return [selectedLat, selectedLng];
        return [28.6139, 77.2090]; // fallback to Delhi or any default
    }, [position, selectedLat, selectedLng]);


    return (
        <MapContainer center={centerPosition} ref={mapRef} zoom={13} style={{ height: "100%", width: "100%" }} >
            <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />

            {/* TRANSIT LAYER */}
            {showTransitLayer && (
                <TileLayer
                    url={tileUrl}
                    attribution='&copy; <a href="https://www.thunderforest.com/">Thunderforest</a>, © OpenStreetMap contributors'
                />
            )}

            {/* SELECTED LOCATION */}
            {selectedPlace && selectedLat != null && selectedLng != null && (
                <Marker position={[selectedLat, selectedLng]} icon={userIcon}>
                    <Popup className='transparent-popup'>
                        <strong>{selectedPlace.address || selectedPlace.name}</strong>
                    </Popup>
                </Marker>
            )}

            {/* CURRENT LOCATION */}
            {!selectedPlace && position && (
                <Marker position={position} icon={userIcon}>
                    <Popup className='transparent-popup'>
                        <strong>Your Location</strong>
                    </Popup>
                </Marker>
            )}

            {/* NEARBY POIs */}
            {memoizedPOIMarkers}

            {/* RECENTER TO SELECTED OR CURRENT LOCATION */}
            <FlyToLocation />

            {/* RECENTER BUTTON */}
            {(selectedPlace || poiType || position) && (
                <Recenter
                    mapRef={mapRef}
                    setPosition={setPosition}
                    setSelectedPlace={setSelectedPlace}
                />
            )}
        </MapContainer>
    )
}

export default MapRenderer
