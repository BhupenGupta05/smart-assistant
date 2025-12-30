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

    useSearchSelection({
        selectedPlace,
        mode,
        activeField,
        setPosition,
        setOrigin,
        setDestination,
        setActiveField,
        clearSelection: () => setSelectedPlace(null)
    });
};
