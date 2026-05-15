import { useContext } from "react";
import { POIContext } from '../context/POIContext'

export const usePOI = () => {
    const context = useContext(POIContext);

    if (!context) {
        throw new Error("usePOI must be used within a POIProvider");
    }

    return context;
};
