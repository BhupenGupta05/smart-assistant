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

            const icon = poiType === 'transit_station' ? transitIcon : (isActive ? highlightedPoiIcon : poiIcon);

            return (
                <POIMarker
                    key={poiId}
                    poi={poi}
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
                    }} />
            )
        })
    }, [poiResults, activePOIId, poiType, selectedPlace])

    return (

        <MapContainer center={position} ref={mapRef} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />

            {/* TRANSIT LAYER */}
            {showTransitLayer && (
                <TileLayer
                    url={tileUrl}
                    attribution='&copy; <a href="https://www.thunderforest.com/">Thunderforest</a>, © OpenStreetMap contributors'
                />

            )}


            {/* SELECTED LOCATION */}
            {selectedPlace && (
                <>
                    <Marker position={[selectedPlace.lat, selectedPlace.lng]} icon={userIcon}>
                        <Popup>
                            <strong>{selectedPlace.address}</strong>
                        </Popup>
                    </Marker>
                </>
            )}

            {/* CURRENT LOCATION */}
            {!selectedPlace && position && (
                <>
                    <Marker position={position} icon={userIcon}>
                        <Popup>
                            <strong>Your Location</strong>
                        </Popup>
                    </Marker>
                </>
            )}


            {/* NEARBY POIs */}
            {memoizedPOIMarkers}

            {/* RECENTER TO SELECTED OR CURRENT LOCATION */}
            {/* <FlyToLocation coords={getCoords()} /> */}
            <FlyToLocation />


            {/* RECENTER BUTTON */}
            {(selectedPlace || poiType || position) && (
                <Recenter
                    mapRef={mapRef}
                    setPosition={setPosition}
                    setSelectedPlace={setSelectedPlace} />
            )}
        </MapContainer>
    )
}

export default MapRenderer
