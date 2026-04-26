import { Flag } from 'lucide-react';

const Report = ({ mode, setMode }) => {
    return (
        <button
            onClick={() =>
                setMode(prev => (prev === "report" ? "search" : "report"))
            }
            className={` h-9 w-9
        md:h-9 md:w-9
        lg:h-10 lg:w-10
    rounded-xl
    backdrop-blur-md
    shadow-lg
    ring-1 ring-black/5
    transition
    flex items-center justify-center ${mode === "report" ? "bg-red-600 hover:bg-red-500 text-white" : "bg-white text-red-600 hover:bg-gray-100"}`}
        >
            <Flag className="h-[14px] w-[14px] md:h-4 md:w-4 lg:h-5 lg:w-5" />
        </button>
    )
}

export default Report
