import DirectionControls from "./DirectionControls";
import { useDirectionControlsLogic } from "../hooks/useDirectionControlsLogic";
import { useSearchProvider } from "../../../../providers/SearchProvider";

const Container = ((props, _externalRef) => {
  const { directionsRef } = useSearchProvider();
  const logic = useDirectionControlsLogic(props, directionsRef);
  
  return <DirectionControls {...props} {...logic} />;
});

export default Container;
