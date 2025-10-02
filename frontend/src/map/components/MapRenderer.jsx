import { useMemo } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import FlyToLocation from '../FlyToLocation'
import Recenter from './Recenter'
import POIMarker from './POIMarker'
import "leaflet/dist/leaflet.css";
import { userIcon, transitIcon, poiIcon, highlightedPoiIcon, smallIcon } from '../icons/markers'
import DirectionsLayer from '../../components/DirectionsLayer'

const MapRenderer = ({
    mapRef,
    position,
    origin,
    destination,
    selectedPlace,
    poiResults,
    activePOIId,
    setHoverPOIId,
    setSelectedPlace,
    poiType,
    showTransitLayer,
    tileUrl,
    setPosition,
    routes,
    mode,
    setMode,
    selectedMode,
    setSelectedMode
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


    const centerPosition = useMemo(() => {
        if (destination) return [destination.lat, destination.lng];   // prioritize destination
        if (origin) return [origin.lat, origin.lng];                 // else origin
        if (selectedLat != null && selectedLng != null) return [selectedLat, selectedLng];
        if (position) return position;                               // fallback to current location
        return [28.6139, 77.2090];                                   // ultimate fallback (Delhi or any default)
    }, [destination, origin, selectedLat, selectedLng, position]);


    // console.log("MODE: ", mode);


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
            {mode === "search" && selectedPlace && selectedLat != null && selectedLng != null && (
                <Marker position={[selectedLat, selectedLng]} icon={userIcon}>
                    <Popup className='transparent-popup'>
                        <strong>{selectedPlace.address || selectedPlace.name}</strong>
                    </Popup>
                </Marker>
            )}

            {/* CURRENT LOCATION */}
            {mode === "search" && !selectedPlace && position && (
                <Marker position={position} icon={userIcon}>
                    <Popup className='transparent-popup'>
                        <strong>Your Location</strong>
                    </Popup>
                </Marker>
            )}

            {/* DIRECTIONS MODE: origin & destination */}
            {mode === "directions" && origin && (
                <Marker position={[origin.lat, origin.lng]} icon={smallIcon} >
                    <Popup>Origin: {origin.name || "Current Location"}</Popup>
                </Marker>
            )}

            {mode === "directions" && destination && (
                <Marker position={[destination.lat, destination.lng]} icon={smallIcon} >
                    <Popup>Destination: {destination.name}</Popup>
                </Marker>
            )}


            {/* ✅ Draw route when both origin & destination exist */}
            {origin && destination && routes?.length > 0 && (
                <DirectionsLayer routes={routes} selectedMode={selectedMode} setSelectedMode={setSelectedMode} />
            )}


            {/* NEARBY POIs */}
            {mode === "search" && memoizedPOIMarkers}

            {/* RECENTER TO SELECTED OR CURRENT LOCATION */}
            <FlyToLocation />

            {/* RECENTER BUTTON */} 
            {(selectedPlace || poiType || position) && (
                // <Recenter
                //     mapRef={mapRef}
                //     setPosition={setPosition}
                //     setSelectedPlace={setSelectedPlace}
                // />

                // NOW, THIS ACCOMODATES CENTERING ROUTE ALSO
                <Recenter
                    mapRef={mapRef}
                    mode={mode}
                    routes={routes}
                    selectedMode={selectedMode}
                    setPosition={setPosition}
                    setSelectedPlace={setSelectedPlace}
                />

            )}
        </MapContainer>
    )
}

export default MapRenderer
