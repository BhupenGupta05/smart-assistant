import { useEffect, useRef, useState } from "react";

export default function usePOISidebar(poiResults, selectedPlace) {
    const itemRefs = useRef({});
    // BUG FIX: CLICKING ON PLACE CRETED A SNAPPY EFFECT BECAUSE OF scrollIntoView
    // WHEN USER MANUALL SELECTS A PLACE IN SIDEBAR, scrollIntoView SHOULD NOT WORK
    const userClickedRef = useRef(false);
    const containerRef = useRef(null); // HIDE DIVIDER ON TOP
    const [showDivider, setShowDivider] = useState(false);

    // Scroll detection for header border
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            setShowDivider(container.scrollTop > 8);
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (selectedPlace && !userClickedRef.current) {
            const poiId = selectedPlace.place_id || poiResults.indexOf(selectedPlace);
            const currentItem = itemRefs.current[poiId];
            if (currentItem) {
                currentItem.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }

        // RESET FLAG
        userClickedRef.current = false;
    }, [selectedPlace, poiResults]);

    return {
        itemRefs,
        containerRef,
        showDivider,
        userClickedRef
    };
}
