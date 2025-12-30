import { createContext, useContext } from "react";
import {useDirections} from '../hooks/useDirections'
import { getCurrentPosition } from '../../search/utils/getCurrentPosition'

const DirectionsContext = createContext();

export const DirectionsProvider = ({ children }) => {
  const directions = useDirections({ getCurrentPosition });
  return (
    <DirectionsContext.Provider value={directions}>
      {children}
    </DirectionsContext.Provider>
  );
};

export const useDirectionsContext = () => {
  const ctx = useContext(DirectionsContext);
  if (!ctx) {
    throw new Error("useDirectionsContext must be used inside DirectionsProvider");
  }
  return ctx;
};