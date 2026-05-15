import { useState, useEffect } from "react";
import { fetchPlaces, useFetchPlaces } from "../../../../hooks/useFetchPlaces";

export const useDirectionInputs = ({
    origin,
    destination,
    selectOrigin,
    selectDestination
}) => {
    

    // BUFFER STATES TO SHOW TYPED INPUT IN THE BOXES
    // WITHOUT AFFECTING THE ACTUAL ORIGIN/DESTINATION UNTIL SELECTED
    // THUS AVOIDING UNWANTED API CALLS WHEN USER IS TYPING
    const [originInput, setOriginInput] = useState(origin?.name || "");
    const [destinationInput, setDestinationInput] = useState(destination?.name || "");

    const {
        results: originResults,
        suppressNextFetch: suppressOriginFetch
    } = useFetchPlaces(originInput);

    const {
        results: destinationResults,
        suppressNextFetch: suppressDestinationFetch
    } = useFetchPlaces(destinationInput);

    // Sync originInput when origin prop changes externally
    useEffect(() => {
        if (origin) {
            setOriginInput(origin.address || origin.name || "");
        }
    }, [origin]);

    // Sync destinationInput when destination prop changes externally
    useEffect(() => {
        if (destination) {
            setDestinationInput(destination.address || destination.name || "");
        }
    }, [destination]);

    const handleOriginEnter = async () => {
        const results = await fetchPlaces(originInput);
        if (results.length > 0) selectOrigin(results[0]);
    };

    const handleDestinationEnter = async () => {
        const results = await fetchPlaces(destinationInput);
        if (results.length > 0) selectDestination(results[0]);
    };

    return {
        //state
        originInput,
        destinationInput,

        //setters
        setOriginInput,
        setDestinationInput,

        //sutocomplete
        originResults,
        destinationResults,

        //suppressors
        suppressOriginFetch,
        suppressDestinationFetch,

        //handlers
        handleOriginEnter,
        handleDestinationEnter
    }

}