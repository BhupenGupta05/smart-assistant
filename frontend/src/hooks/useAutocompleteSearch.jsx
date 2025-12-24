// NOT USED ANYWHERE
import { useState } from "react";
import { usePlacesSearch } from "./usePlacesSearch";

export const useAutocompleteSearch = (initialPlace = null) => {
  const [query, setQuery] = useState(initialPlace?.address || "");
  const [selectedPlace, setSelectedPlace] = useState(initialPlace);
  const [showResults, setShowResults] = useState(false);

  const { results, loading } = usePlacesSearch(query);

  const handlePlaceSelect = (place) => {
    if (!place?.lat || !place?.lng) return;

    setSelectedPlace(place);
    setQuery(place.address);
    setShowResults(false);
  };

  /**
   * Used by Chatbot / external commands
   * Example: "Search cafes near CP"
   */
  const setFromExternal = async (place) => {
    if (!place) return;
    handlePlaceSelect(place);
  };

  return {
    query,
    setQuery,
    results,
    loading,
    showResults,
    setShowResults,
    selectedPlace,
    handlePlaceSelect,
    setFromExternal,
  };
};
