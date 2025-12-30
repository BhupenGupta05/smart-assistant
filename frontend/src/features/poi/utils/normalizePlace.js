// Helper function to normalize place data from various formats
export const normalizePlace = (place) => {
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
    } 

    if (lat == null || lng == null) return null;

    return {
        name: place.name || place.formatted_address,
        address: place.formatted_address || place.name,
        location: [lat, lng],
        lat,
        lng,
        place_id: place.place_id || place.id
    };
};