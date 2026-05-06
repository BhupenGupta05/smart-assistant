import { normalizePlace } from "../../../../features/poi/utils/normalizePlace";
import { getCurrentPosition } from "../../../../features/search/utils/getCurrentPosition";
import { useMapUI } from "../../../../providers/MapUIProvider";

export const useSearchControlsLogic = () => {

  const {
    setOrigin,
    setDestination,
    setMode,
    setActiveField
  } = useMapUI();

  const onStartDirections = async (place) => {
    const destination = normalizePlace(place);
    if (!destination) return;

    try {
      const coords = await getCurrentPosition();

      setOrigin({
        name: "Current Location",
        address: "Your current location",
        location: coords,
        lat: coords[0],
        lng: coords[1]
      });

      setDestination(destination);
      setMode("directions");
      setActiveField(null);
    } catch {
      console.warn("Failed to get current location");
    }
  };

  return { onStartDirections };
};
