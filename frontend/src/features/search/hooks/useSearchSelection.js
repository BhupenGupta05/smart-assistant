import { useEffect } from "react";
import { normalizePlace } from "../../poi/utils/normalizePlace";

export function useSearchSelection({
  selectedPlace,
  mode,
  activeField,
  setPosition,
  setOrigin,
  setDestination,
  setActiveField,
  clearSelection
}) {
  useEffect(() => {
    if (!selectedPlace) return;

    const normalized = normalizePlace(selectedPlace);
    if (!normalized) return;

    if (mode === "search") {
      setPosition(normalized.location);
      return;
    }

    if (mode === "directions") {
      if (activeField === "origin") setOrigin(normalized);
      if (activeField === "destination") setDestination(normalized);
      setActiveField(null);
      clearSelection();
    }
    
  }, [selectedPlace, mode, activeField]);
}
