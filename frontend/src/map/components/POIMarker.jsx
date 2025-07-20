import React from 'react'
import { Marker, Popup } from 'react-leaflet';

const POIMarker = React.memo(({ poiId, poi, icon, onMouseOver, onMouseOut, onClick }) => {
    return (
        <Marker
            position={[poi.lat, poi.lng]}
            icon={icon}
            eventHandlers={{
                mouseover: () => onMouseOver(poiId),
                mouseout: () => onMouseOut(),
                click: () => onClick(poi)
            }}>

            <Popup>
                <strong>{poi.name}</strong><br />
                📍 {poi.address}<br />
                ⭐ {poi.user_ratings_total} ratings
            </Popup>
        </Marker>
    )
}, (prev, next) =>
    prev.poiId === next.poiId &&
    prev.icon === next.icon &&
    prev.poi.lat === next.poi.lat &&
    prev.poi.lng === next.poi.lng)

export default POIMarker
