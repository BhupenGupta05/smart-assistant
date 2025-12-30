import { forwardRef } from "react";
import DirectionControls from "./DirectionControls";
import { useDirectionControlsLogic } from "../hooks/useDirectionControlsLogic";

const Container = forwardRef((props, ref) => {
  const logic = useDirectionControlsLogic(props, ref);
  return <DirectionControls {...props} {...logic} />;
});

export default Container;
