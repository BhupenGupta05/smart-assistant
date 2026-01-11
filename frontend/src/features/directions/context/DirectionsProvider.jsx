import { DirectionsContext } from "./DirectionsContext";
import { useDirections } from "../hooks/useDirections";

export const DirectionsProvider = ({ children }) => {
  const directions = useDirections();

  return (
    <DirectionsContext.Provider value={directions}>
      {children}
    </DirectionsContext.Provider>
  );
};
