import { DirectionsProvider } from '../features/directions/context/DirectionsProvider'
import NetworkProvider from '../features/network/providers/NetworkProvider'
import { POIProvider } from '../features/poi/providers/POIProvider'
import { GeolocationProvider } from '../hooks/useGeolocationContext'
import { MapUIProvider } from './MapUIProvider'
import { SearchProvider } from './SearchProvider'

const AppProvider = ({ children }) => {
  return (
    <NetworkProvider>
      <GeolocationProvider>
        <DirectionsProvider>
          <MapUIProvider>
            <SearchProvider>
              <POIProvider>
                {children}
              </POIProvider>
            </SearchProvider>
          </MapUIProvider>
        </DirectionsProvider>
      </GeolocationProvider>
    </NetworkProvider>

  )
}

export default AppProvider