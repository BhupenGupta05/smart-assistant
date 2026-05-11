import DirectionControls from "./DirectionControls";
import { useDirectionControlsLogic } from "../hooks/useDirectionControlsLogic";
import { useSearchRefs } from "../../../../providers/SearchProvider";

const Container = ((props, _externalRef) => {
  const { directionsRef } = useSearchRefs();
  const logic = useDirectionControlsLogic(props, directionsRef);
  
  return <DirectionControls {...props} {...logic} />;
});

export default Container;
