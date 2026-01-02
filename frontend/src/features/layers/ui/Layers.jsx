import { Layers } from "lucide-react"

const LayersTile = ({ showTransitLayer, setShowTransitLayer }) => {
  return (
    <button
    onClick={() => setShowTransitLayer(!showTransitLayer)}
      className={`
        h-9 w-9
        md:h-9 md:w-9
        lg:h-10 lg:w-10
    rounded-xl
    bg-white
    backdrop-blur-md
    shadow-lg
    ring-1 ring-black/5
    hover:bg-gray-100
    transition
    flex items-center justify-center
    `}
      title="Map Tiles"
    >
      <Layers className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5" />
    </button>
  )
}

export default LayersTile
