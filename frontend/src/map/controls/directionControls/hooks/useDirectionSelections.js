import {normalizePlace} from '../../../../features/poi/utils/normalizePlace'

export const useDirectionSelections = ({
    origin,
    destination,
    setOrigin,
    setDestination,
    setOriginInput,
    setDestinationInput,
    suppressOriginFetch,
    suppressDestinationFetch,
    setMode,
    setActiveField,
    setSelectedPlace,
    clearRoutes
}) => {

    // Selection handlers
    const selectOrigin = (place) => {
        clearRoutes?.();
        const normalized = normalizePlace(place);
        if (!normalized) return;

        setOrigin(normalized);
        setOriginInput(normalized.address || normalized.name);
        setActiveField(null);
        suppressOriginFetch();
    };

    const selectDestination = (place) => {
        clearRoutes?.();
        const normalized = normalizePlace(place);
        if (!normalized) return;

        setDestination(normalized);
        setDestinationInput(normalized.address || normalized.name);
        setActiveField(null);
        suppressDestinationFetch();
    };

    const swapEnds = async () => {
        setOrigin(destination);
        setDestination(origin);
        setOriginInput(destination?.name || "");
        setDestinationInput(origin?.name || "");

        // Set flags to prevent search after swap
        suppressOriginFetch();
        suppressDestinationFetch();
    };


    // Clear
    const clearAll = () => {
        clearRoutes?.();
        setMode("search");
        setActiveField(null);
        setOrigin(null);
        setDestination(null);
        setOriginInput("");
        setDestinationInput("");
        setSelectedPlace(null);
    };

    return {
        selectOrigin,
        selectDestination,
        swapEnds,
        clearAll
    }

}