import axios from "axios";

export async function searchPlaces(query, isOnline) {
    if (!isOnline) {
        console.log("Offline → skipping searchPlaces");
        return [];
    }

    const url = `${import.meta.env.VITE_BASE_URL}/api/search?query=${encodeURIComponent(query)}`;

    try {
        const { data } = await axios.get(url);
        return data;
    } catch (error) {
        console.error('Search error:', error);
        return [];
    }
}