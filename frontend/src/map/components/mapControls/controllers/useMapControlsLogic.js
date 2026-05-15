import { useCallback } from "react";
import { useSearchSelection } from "../../../../features/search/hooks/useSearchSelection";

export const useMapControlsLogic = ({
    selectedPlace,
    mode,
    activeField,
    setPosition,
    setOrigin,
    setDestination,
    setActiveField,
    setSelectedPlace,
    setMode
}) => {

    const clearSelection = useCallback(() => setSelectedPlace(null), [setSelectedPlace]);

    useSearchSelection({
        selectedPlace,
        mode,
        activeField,
        setPosition,
        setOrigin,
        setDestination,
        setActiveField,
        clearSelection
    });
};
