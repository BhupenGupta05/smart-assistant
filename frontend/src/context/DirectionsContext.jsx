import { createContext, useContext } from "react";
import { useDirections } from "../hooks/useDirections";

const DirectionsContext = createContext();

export const DirectionsProvider = ({ children }) => {
  const directions = useDirections(); 
  return (
    <DirectionsContext.Provider value={directions}>
      {children}
    </DirectionsContext.Provider>
  );
};

export const useDirectionsContext = () => useContext(DirectionsContext);
