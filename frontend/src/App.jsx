import Chatbot from './components/Chatbot'
import MapView from './map/MapView'
import SimpleMap from './map/SimpleMap'

const App = () => {
  return (
    <div className='text-center text-2xl font-bold'>
      <MapView />
      <Chatbot />
      {/* <SimpleMap /> */}
    </div>
  )
}

export default App
