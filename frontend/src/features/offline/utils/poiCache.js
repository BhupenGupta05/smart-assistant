const PREFIX = "offline_cache_v1";

export function saveCache(key, data) {
    try {
        localStorage.setItem(
            PREFIX + key,
            JSON.stringify({
                data,
                timestamp: Date.now()
            })
        );
    } catch (err) {
        console.warn("Cache save failed", err);
    }
}

export function loadCache(key, maxAge = Infinity) {
    try {
        const raw = localStorage.getItem(PREFIX + key);
        if (!raw) return null;

        const parsed = JSON.parse(raw);
        if (Date.now() - parsed.timestamp > maxAge) return null;

        return parsed.data;

    } catch (err) {
        console.warn("Cache load failed", err);
        return null;
    }
}

// FOR ACCESSING TIMESTAMP ONLY
export function loadCacheMeta(key) {
    try {
        const raw = localStorage.getItem(PREFIX + key);
        if (!raw) return null;

        const { timestamp } = JSON.parse(raw);
        return timestamp;
    } catch {
        return null;
    }
}
