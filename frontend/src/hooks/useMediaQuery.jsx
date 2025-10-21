import { useEffect, useState } from "react"

export const useMediaQuery = (query) => {

    // In Server Side Rendering (SSR), window is not defined. So we need to make sure that we only access window when it's available.
    const [matches, setMatches] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia(query).matches;
        }
        return false;
    });

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }
        // When your component first renders, we need to know the current screen size immediately. Without this, matches would be false initially (from useState(false)) even if the screen actually matches the query.
        // media will be an object with a 'matches' property which is a boolean 
        const media = window.matchMedia(query)

        setMatches(media.matches);

        // Event listener for future changes
        // listener is a callback function which will be called when user rotates the device or resizes the browser window
        const listener = (event) => {
            setMatches(event.matches);
        }

        // Whenever the media query's evaluated result changes, the listener function will be called, instead of firing every time there's a resize event
        media.addEventListener('change', listener)

        return () => {
            media.removeEventListener('change', listener);
        }

    }, [query]);

    return matches;
}

export const useBreakpoints = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
    const isDesktop = useMediaQuery('(min-width: 1025px) and (max-width: 1439px)');
    const isLargeDesktop = useMediaQuery('(min-width: 1440px)');

    return {
        isMobile,
        isTablet,
        isDesktop,
        isLargeDesktop
    }
}

// Individual hooks for backward compatibility
export const useIsMobile = () => useMediaQuery('(max-width: 768px)');
export const useIsTablet = () => useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px) and (max-width: 1439px)');
export const useIsLargeDesktop = () => useMediaQuery('(min-width: 1440px)');