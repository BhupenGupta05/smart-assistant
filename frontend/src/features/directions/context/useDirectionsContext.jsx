import { useContext } from "react";
import { DirectionsContext } from "./DirectionsContext";

export const useDirectionsContext = () => {
  const ctx = useContext(DirectionsContext);
  if (!ctx) {
    throw new Error("useDirectionsContext must be used inside DirectionsProvider");
  }
  return ctx;
};
