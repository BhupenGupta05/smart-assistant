import { useEffect, useState } from "react";

export const useDebouncedPosition = (position, delay = 500) => {
    const [debouncedPosition, setDebouncedPosition] = useState(position);

    useEffect(() => {
        if(!position) return;

        const timer = setTimeout(() => {
            setDebouncedPosition(position);
        }, delay);

        return () => clearTimeout(timer);
    }, [position, delay]);

    return debouncedPosition;
}