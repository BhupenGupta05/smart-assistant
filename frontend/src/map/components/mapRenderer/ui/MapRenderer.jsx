import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet'
import FlyToLocation from '../../../../components/FlyToLocation';
import POIMarker from '../../../../features/poi/ui/POIMarker';
import "leaflet/dist/leaflet.css";
import { userIcon, smallIcon } from '../../../icons/markers'
import DirectionsLayer from '../../../../features/directions/ui/DirectionsLayer';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { createClusterCustomIcon } from '../../../icons/CustomClusterIcon';
import { useMapRendererLogic } from '../controllers/useMapRendererLogic';

const MapRenderer = ({
    mapRef,
    position,
    origin,
    destination,
    selectedPlace,
    poiResults,
    hoverPOIId,
    setHoverPOIId,
    setSelectedPlace,
    poiType,
    showTransitLayer,
    tileUrl,
    routes,
    mode,
    selectedMode,
    setSelectedMode
}) => {
    const {
        memoizedPOIMarkers,
        centerPosition,
        selectedLat,
        selectedLng
    } = useMapRendererLogic({
        poiResults,
        hoverPOIId,
        poiType,
        selectedPlace,
        destination,
        origin,
        position
    });

    return (
        <MapContainer
            center={centerPosition}
            ref={mapRef}
            zoom={15}
            zoomControl={false}
            style={{ height: "100%", width: "100%" }}
        >
            <ZoomControl position="bottomleft" />
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />


            {/* TRANSIT LAYER */}
            {showTransitLayer && (
                <TileLayer
                    url={tileUrl}
                    zIndex={10}
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
            {mode === "search" && poiResults.length > 0 && (
                <MarkerClusterGroup
                    chunkedLoading
                    showCoverageOnHover={false}
                    spiderfyOnMaxZoom
                    maxClusterRadius={40}
                    iconCreateFunction={createClusterCustomIcon}
                >
                    {memoizedPOIMarkers.map(({ poiId, poi, icon }) => (
                        <POIMarker
                            key={poiId}
                            poi={poi}
                            poiId={poiId}
                            icon={icon}
                            onMouseOver={() => setHoverPOIId(poiId)}
                            onMouseOut={() => {
                                if (!selectedPlace || selectedPlace.place_id !== poiId) {
                                    setHoverPOIId(null);
                                }
                            }}
                            onClick={() => {
                                setSelectedPlace(poi);
                                setHoverPOIId(null);
                            }}
                        />
                    ))}
                </MarkerClusterGroup>
            )}


            {/* RECENTER TO SELECTED OR CURRENT LOCATION */}
            <FlyToLocation />


        </MapContainer>
    )
}

export default MapRenderer
