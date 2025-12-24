// Fetch nearby POIs based on the current position or selected place
// If the user selects a place from suggestions, it will update the position and fetch POIs again

// Retry fetching POIs every 5 seconds if there was an error
// This will keep trying to fetch POIs until it succeeds
// or the component is unmounted



//state + context only

import { createContext, useContext } from 'react';
import { usePOIController } from './usePOIController';

const POIContext = createContext();


export const POIProvider = ({ children }) => {

    const poi = usePOIController();

    return (
        <POIContext.Provider value={poi}>
            {children}
        </POIContext.Provider>
    );
};

export const usePOI = () => {
    const context = useContext(POIContext);

    if (!context) {
        throw new Error("usePOI must be used within a POIProvider");
    }

    return context;
};
