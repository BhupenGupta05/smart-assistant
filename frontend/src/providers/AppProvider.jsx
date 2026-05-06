import { DirectionsProvider } from '../features/directions/context/DirectionsProvider'
import { GeolocationProvider } from '../hooks/useGeolocationContext'
import { MapUIProvider } from './MapUIProvider'

const AppProvider = ({ children }) => {
  return (
    <GeolocationProvider>
      <DirectionsProvider>
        <MapUIProvider>
          {children}
        </MapUIProvider>

      </DirectionsProvider>
    </GeolocationProvider>
  )
}

export default AppProvider