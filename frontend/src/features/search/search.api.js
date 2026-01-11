import axios from "axios";
import { getIsOnline } from '../network/hooks/getIsOnline'

export async function searchPlaces(query) {
    if (!getIsOnline()) {
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