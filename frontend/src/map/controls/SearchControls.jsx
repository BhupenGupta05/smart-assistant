import SearchBar from "../components/SearchBar"
import POIDetails from "../components/POIDetails"
import AQIIndicator from "../components/AQIIndicator"
import Chatbot from "../../components/Chatbot"
import { normalize } from "../components/MapControls"
import "leaflet/dist/leaflet.css"


const SearchControls = ({
  setOrigin,
  setPosition,
  selectedPlace,
  setSelectedPlace,
  setDestination,
  setActiveField,
  setMode,
  aqi,
  aqiLoading,
  aqiError,
  poiType,
  showTransitLayer,
  setShowTransitLayer,
  searchRef }) => {

  const startDirectionsWith = (place) => {
    console.log("👉 startDirectionsWith got place:", place);
    const destinationPlace = normalize(place);

    console.log("✅ after normalize:", destinationPlace);

    // Destination comes from selected place
    setDestination(destinationPlace);

    // Origin = current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const currentLocation = {
            name: "Current Location",
            address: "Your current location",
            location: [pos.coords.latitude, pos.coords.longitude],
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setOrigin(currentLocation);
          // setPosition(currentLocation.location); // recenter map
        },
        (err) => {
          console.warn("⚠️ Failed to fetch current location:", err);
          setOrigin(null); // fallback if geolocation fails
        }
      );
    }

    setMode("directions");
    setActiveField(null);
    setSelectedPlace(null);
  };

  return (
    <>
      <SearchBar
        ref={searchRef}
        // query={query}
        // setQuery={setQuery}
        setPosition={setPosition}
        setSelectedPlace={setSelectedPlace}
      />

      {/* DETAILS BOTTOM BAR */}
      {selectedPlace && (
        <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-white shadow-xl z-[1000] overflow-y-auto rounded-t-xl">
          <POIDetails
            place={selectedPlace}
            onBack={() => setSelectedPlace(null)}
            onDirections={() => startDirectionsWith(selectedPlace)} />
        </div>
      )}

      {/* Chatbot - bottom right corner */}
      <div className="absolute bottom-4 right-4 z-[1000] w-[300px]">
        <Chatbot />
      </div>

      {/* AQI INDICATOR USING USEAQI HOOK */}
      {!aqiLoading && aqi && (
        <div className="absolute top-4 right-4 z-[1000]">
          <AQIIndicator
            aqi={aqi}
            loading={false}
            error={aqiError} />
        </div>
      )}

      {/* TOGGLE TRANSIT LAYER */}
      {poiType === 'transit_station' && (
        <button
          onClick={() => setShowTransitLayer(!showTransitLayer)}
          className="absolute top-[130px] right-4 z-[1000] bg-white px-4 py-2 rounded-full shadow-md border text-sm font-medium hover:bg-gray-100 transition"
        >
          {showTransitLayer ? "Hide Transit" : "Show Transit"}
        </button>
      )}
    </>
  )
}

export default SearchControls
