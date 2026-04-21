// aqiCache.js
export function saveAQI(lat, lng, aqiValue) {
    const key = `aqi:${lat.toFixed(2)}:${lng.toFixed(2)}`;
    localStorage.setItem(
        key,
        JSON.stringify({ 
            data: aqiValue,  // Store as 'data' property
            timestamp: Date.now() 
        })
    );
}

export function loadAQI(lat, lng, maxAge) {
    const key = `aqi:${lat.toFixed(2)}:${lng.toFixed(2)}`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw);
        
        // Check if data is expired
        if (Date.now() - parsed.timestamp > maxAge) {
            // Clean up expired data
            localStorage.removeItem(key);
            return null;
        }
        
        return parsed; // Returns { data: number, timestamp: number }
    } catch (err) {
        console.error("Failed to parse cached AQI:", err);
        localStorage.removeItem(key); // Clean up corrupted data
        return null;
    }
}