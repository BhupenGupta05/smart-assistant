import { useRef } from "react";

import { useMapUI } from "../../../../providers/MapUIProvider";
import { useSearchQuery } from "../../../../providers/SearchProvider";

import { useDirectionInputs } from "./useDirectionInputs";
import { useDirectionSelections } from "./useDirectionSelections";
import { useDirectionRouting } from "./useDirectionRouting";
import { useDirectionImperative } from "./useDirectionImperative";

export const useDirectionControlsLogic = (
  props,
  ref
) => {
  const {
    setPosition,
    setSelectedPlace,
    getDirections,
    loading,
    error,
    clearRoutes
  } = props;

  const {
    setMode,
    origin,
    setOrigin,
    destination,
    setDestination,
    setActiveField
  } = useMapUI();

  const { setQuery } = useSearchQuery();

  /*
   * Temporary placeholders
   * so selections hook can access them.
   */
  const inputRefs = useRef({});

  // SELECTIONS
  const selections = useDirectionSelections({
    origin,
    destination,

    setOrigin,
    setDestination,

    setOriginInput: (...args) =>
      inputRefs.current.setOriginInput?.(...args),

    setDestinationInput: (...args) =>
      inputRefs.current.setDestinationInput?.(...args),

    suppressOriginFetch: (...args) =>
      inputRefs.current.suppressOriginFetch?.(...args),

    suppressDestinationFetch: (...args) =>
      inputRefs.current.suppressDestinationFetch?.(...args),

    setMode,
    setActiveField,
    setSelectedPlace,
    clearRoutes
  });

  // INPUTS
  const inputs = useDirectionInputs({
    origin,
    destination,
    selectOrigin: selections.selectOrigin,
    selectDestination: selections.selectDestination
  });

  // CONNECT INPUT REFS
  inputRefs.current = {
    setOriginInput: inputs.setOriginInput,
    setDestinationInput: inputs.setDestinationInput,
    suppressOriginFetch: inputs.suppressOriginFetch,
    suppressDestinationFetch:
      inputs.suppressDestinationFetch
  };

  // ROUTING EFFECT
  const routing = useDirectionRouting({
    origin,
    destination,
    getDirections
  });

  // IMPERATIVE API
  useDirectionImperative({
    ref,

    origin,
    destination,

    setMode,

    setPosition,
    setSelectedPlace,

    setQuery,

    getDirections,

    selectOrigin: selections.selectOrigin,
    selectDestination:
      selections.selectDestination,

    clearAll: selections.clearAll
  });

  return {
    // state
    originInput: inputs.originInput,
    destinationInput:
      inputs.destinationInput,

    originResults: inputs.originResults,
    destinationResults:
      inputs.destinationResults,

    canRequestRoute:
      routing.canRequestRoute,

    loading,
    error,

    // setters
    setOriginInput:
      inputs.setOriginInput,

    setDestinationInput:
      inputs.setDestinationInput,

    // handlers
    selectOrigin:
      selections.selectOrigin,

    selectDestination:
      selections.selectDestination,

    swapEnds: selections.swapEnds,

    clearAll: selections.clearAll,

    handleOriginEnter:
      inputs.handleOriginEnter,

    handleDestinationEnter:
      inputs.handleDestinationEnter
  };
};