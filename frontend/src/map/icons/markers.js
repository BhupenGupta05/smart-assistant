import L from 'leaflet'
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";

// BLIP ANIMATION
export const userIcon = new L.DivIcon({
    className: 'user-location-pulse',
    html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg relative">
          <div class="absolute -inset-2 bg-blue-500/30 rounded-full animate-ping"></div>
        </div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});


export const transitIcon = new L.Icon({
    iconUrl: "https://mapmarker.io/api/v3/font-awesome/v6/icon?icon=fa-solid%20fa-train&size=20&color=FF9800",
    iconAnchor: [12, 41],
    shadowSize: [41, 41],
    popupAnchor: [0, -30],
});


// export const poiIcon = new L.Icon({
//     iconUrl: "https://mapmarker.io/api/v3/font-awesome/v6/icon?icon=fa-solid%20fa-map-pin&size=30&color=2196F3",
//     iconAnchor: [12, 41],
//     popupAnchor: [1, -34],
//     shadowSize: [41, 41],
//     popupAnchor: [0, -30],
// })

//new
export const poiIcon = new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: orange; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
});

// export const highlightedPoiIcon = new L.Icon({
//     iconUrl: "https://mapmarker.io/api/v3/font-awesome/v6/icon?icon=fa-solid%20fa-map-pin&size=30&color=4CAF50",
//     iconAnchor: [12, 41],
//     shadowSize: [41, 41],
//     popupAnchor: [0, -30],
// });

//new
export const highlightedPoiIcon = new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: green; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
});

export const smallIcon = new L.Icon({
    iconUrl: markerIcon,
    iconSize: [20, 32],
    iconAnchor: [10, 32],
    popupAnchor: [1, -28],
})