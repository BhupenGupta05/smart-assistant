import { useState, useCallback } from "react";

export default function usePOICategory() {

  const [showMore, setShowMore] = useState(false);

  const onCategorySelect = useCallback(
    (type) => {
      // UI intent: open modal
      if (type === "more") {
        setShowMore(true);
        return null;
      }
      return type;
    },
    []
  );

  const closeMore = useCallback(() => {
    setShowMore(false);
  }, []);

  return {
    showMore,
    onCategorySelect,
    closeMore
  };
}
