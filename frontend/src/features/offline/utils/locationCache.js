const LOCATION_KEY = 'last_known_location';

export function saveLocation(lat, lng) {
  try {
    localStorage.setItem(LOCATION_KEY, JSON.stringify({ lat, lng, timestamp: Date.now() }));
  } catch (err) {
    console.warn("Failed to save location", err);
  }
}

export function loadLocation(maxAge = 24 * 60 * 60 * 1000) { // 24 hours default
  try {
    const raw = localStorage.getItem(LOCATION_KEY);
    if (!raw) return null;
    
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.timestamp > maxAge) return null;
    
    return { lat: parsed.lat, lng: parsed.lng };
  } catch (err) {
    console.warn("Failed to load location", err);
    return null;
  }
}