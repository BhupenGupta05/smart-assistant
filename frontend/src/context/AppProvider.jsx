import { GeolocationProvider } from "../hooks/useGeolocationContext";
import { POIProvider } from "../hooks/usePOIContext";

const AppProvider = ({ children }) => {
  return (
    <GeolocationProvider>
      <POIProvider>
          {children}
      </POIProvider>
    </GeolocationProvider>
  );
};

export default AppProvider;
