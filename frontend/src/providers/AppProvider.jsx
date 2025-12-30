import { DirectionsProvider } from '../features/directions/context/DirectionsContext'
import { GeolocationProvider } from '../hooks/useGeolocationContext'

const AppProvider = ({ children }) => {
  return (
    <GeolocationProvider>
      <DirectionsProvider>
        {children}
      </DirectionsProvider>
    </GeolocationProvider>
  )
}

export default AppProvider