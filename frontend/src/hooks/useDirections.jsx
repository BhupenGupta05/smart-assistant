import { useCallback } from "react";
import { useState } from "react"
import axios from "axios";


export const useDirections = () => {
    const [routes, setRoutes] = useState([]);
    const [selectedMode, setSelectedMode] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getDirections = useCallback(async (origin, destination, modes = ["driving", "walking", "transit", "bicycling"]) => {
        // console.log("ORIGIN", origin);
        // console.log("DESTINATION", destination);


        if (!origin || !destination) return;
        setLoading(true);

        try {
            const qs = new URLSearchParams({
                origin: origin.join(","),
                destination: destination.join(","),
                modes: modes.join(",")
            });

            // console.log("SEARCH PARAMS:", qs.toString());
            


            const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/directions?${qs}`);
            // console.log("DATA FETCHED:", data.routes);
            
            setRoutes(data.routes || []);
            // console.log("ROUTES SET:", routes);
            
            setSelectedMode(data.routes?.[0]?.mode || null);
            setError(null);
        } catch (e) {
            console.error("directions fetch failed:", e.message);
            setRoutes([]);
            setSelectedMode(null);
            setError("Could not fetch directions");
        } finally {
            setLoading(false);
        }
    }, []);

    return { routes, selectedMode, setSelectedMode, getDirections, loading, error };
}