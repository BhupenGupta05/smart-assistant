import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAssistant } from '../hooks/useAssistant';
import { MessagesSquare, X } from 'lucide-react';

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi! Ask me anything 🚀' },
    ]);

    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const chatRef = useRef(null);


    const toggleChat = () => setIsOpen(!isOpen);

    const {
        searchRef,
        directionsRef,
        setPosition,
        setSelectedPlace,
        setPoiType,
        // setPoiResults,
        // refetchPOIs,
        setQuery,
        setShowTransitLayer
    } = useAssistant();

    // CONTROLLING SEARCH BAR USING CHATBOT PROMPT
    const moveToLocation = async (location) => {
        if (directionsRef.current?.switchToSearchMode) {
            directionsRef.current.switchToSearchMode();
            console.log("🧭 Switched to search mode before moving map");
        }
        if (location === 'current') {
            console.log("🧭 Moving to current location via chatbot");

            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        setPosition([pos.coords.latitude, pos.coords.longitude]);
                        setSelectedPlace(null);
                        resolve("Moved to current location");
                    },
                    () => reject(new Error("Failed to get current location. Please check location permissions.")),
                    { timeout: 10000, enableHighAccuracy: true }
                );
            });
        } else {
            let success = await searchRef.current?.searchLocationAndSelectFirst(location); // CONTROLLING SEARCH FUNCTIONALITY USING IMPERATIVE HANDLE

            if (!success && directionsRef.current?.switchToSearchMode) {
                console.log("Inside directionsref");

                success = await directionsRef.current.searchLocation(location);
            }
            console.log(success);

            // const success = await searchRef.current?.searchLocationAndSelectFirst(location); // CONTROLLING SEARCH FUNCTIONALITY USING IMPERATIVE HANDLE
            if (!success) throw new Error(`Could not find location: "${location}". Try a more specific address.`);
            return `Successfully moved to ${location}`;
        }
    };

    // SETTING POIs USING CHATBOT PROMPT
    const setPoi = (poi) => {
        if (!poi) throw new Error("No POI type specified");
        setPoiType(poi);
        // refetchPOIs?.();
        return `Showing ${poi} places nearby`;
    };

    // TOGGLING TRANSIT LAYER USING CHATBOT PROMPT
    const toggleTransit = () => {
        setShowTransitLayer(prev => !prev);
        return "Toggled transit layer";
    };

    // DISPLAYING POIs USING CHATBOT PROMPT
    const searchPoi = (args) => {
        if (!args.type && !args.query) throw new Error("What kind of place are you looking for?");
        const poi = args.type || args.query;
        setPoiType(poi); // triggers automatic fetching
        return `Showing nearby ${poi}`;
    };

    // HELPER FUNCTION
    // WAITING TILL THE DIRECTION REF MOUNTS SO THAT WE CAN SET ORIGIN/DESTINATION IN INPUTS
    const waitForRef = async (ref, retries = 10, delay = 200) => {
        let count = 0;
        while ((!ref.current || !ref.current.ready) && count < retries) {
            await new Promise(r => setTimeout(r, delay));
            count++;
        }
        return ref.current;
    };

    // Utility: FETCH COORDINATES FROM STRING
    const getCurrentLocation = () =>
        new Promise((resolve, reject) => {
            if (!navigator.geolocation) return reject(new Error("Geolocation not supported"));

            console.log("Fetching current location...");

            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({
                    name: "Current Location",
                    address: "Your current location",
                    location: [pos.coords.latitude, pos.coords.longitude],
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                }),
                (err) => reject(new Error("Failed to get current location")),
                { enableHighAccuracy: true, timeout: 10000 }
            );

        });

    // --- Set Directions (controls origin & destination inputs) ---
    const setDirections = async ({ origin = 'current', destination, mode = 'driving' }) => {
        const dirRef = await waitForRef(directionsRef);
        if (!dirRef) throw new Error('Directions controls not ready');
        if (!destination) throw new Error('Destination is required');

        let success;

        // If origin is current location, fetch coordinates for it and set ref's value
        if (origin.toLowerCase() === 'current location' || origin === "current") {

            const pos = await getCurrentLocation();

            success = await directionsRef.current.searchAndSetOrigin('', pos.location);
        } else {

            success = await directionsRef.current.searchAndSetOrigin(origin);

        }
        if (!success) throw new Error('Failed to set origin');

        // SET DESTINATION ALSO
        success = await dirRef.searchAndSetDestination(
            typeof destination === 'string' ? destination : destination.name
        );
        if (!success) throw new Error('Failed to set destination');


        dirRef.switchToDirectionsMode(); // SWITCH TO DIRETCIONS MODE
        await dirRef.calculateDirections(); // CALCULATE ROUTE

        return `✅ Directions set from ${origin} to ${destination.name || destination}`;
    };


    const runTool = async (tool, lastUserMessage) => {
        console.log("Running tool:", tool.function.name, "with args:", tool.function.arguments);
        const { name: rawName, arguments: argsJSON } = tool.function;
        const args = JSON.parse(argsJSON);

        let command = rawName;

        // FORCING CHATBOT IF "ROUTE" KEYWORD IS INCLUDED IN PROMPT, 
        // THEN RUN set_directions INSTEAD OF move_to_location
        if (command === 'move_to_location' && lastUserMessage.toLowerCase().includes("route")) {
            command = 'set_directions';
            args.destination = { name: args.location };
        }

        console.log("FRONTEND: Parsed args:", args);

        switch (command) {
            case 'move_to_location':
                return await moveToLocation(args.location);

            case 'set_poi_type':
                return setPoi(args.poi);

            case 'toggle_transit_layer':
                return toggleTransit();

            case 'search_poi':
                return searchPoi(args);


            case 'set_directions':
                console.log("FRONTEND: setDestination input:", args);
                return await setDirections({ origin: args.origin || 'current', destination: args.destination, mode: args.mode || 'driving' });

            default:
                throw new Error(`Unknown command: ${command}`);
        }
    };


    const sendmessage = async () => {
        if (loading) {
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: '🕓 Please wait — I\'m still working on your last command.' }
            ]);
            return;
        }

        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        const newMessages = [...messages, userMessage];

        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const { data } = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/chat`, { messages: newMessages });

            console.log("FRONTEND: Received from backend:", JSON.stringify(data, null, 2));


            // Show LLM reply if available
            const withReply = data.reply
                ? [...newMessages, { role: 'assistant', content: data.reply }]
                : [...newMessages];

            setMessages(withReply);

            // If tools were returned, run them immediately
            if (data.tool_calls?.length > 0) {
                for (const toolCall of data.tool_calls) {
                    try {
                        const result = await runTool(toolCall, userMessage.content);
                        setMessages(prev => [
                            ...prev,
                            { role: 'assistant', content: `✅ ${result}` }
                        ]);
                    } catch (err) {
                        setMessages(prev => [
                            ...prev,
                            { role: 'assistant', content: `❌ ${err.message}` }
                        ]);
                    }
                }
            }

        } catch (error) {
            let errorMessage = '⚠️ Something went wrong.';
            if (error.response?.status === 429) errorMessage = '⚠️ Too many requests.';
            else if (error.response?.status >= 500) errorMessage = '⚠️ Server error.';
            else if (error.code === 'NETWORK_ERROR') errorMessage = '⚠️ Network error.';

            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: errorMessage }
            ]);
        } finally {
            setLoading(false);
        }
    };


    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !loading) {
            e.preventDefault();
            sendmessage();
        }
    };

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="fixed bottom-5 right-5 z-[9999] bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition active:scale-95"
                >
                    <MessagesSquare className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600' />
                </button>
            )}

            {/* IMPLEMENT ANIMATE SLIDE-DOWN */}

            {isOpen && (
                <div ref={chatRef} className='chatbot animate-slide-up z-[9999]'>
                    <div className='chat-header flex justify-between items-center'>
                        <span>🤖 Smart Assistant</span>
                        <button
                            onClick={toggleChat}
                            className="text-white hover:text-gray-300 transition"
                        >
                            <X className='w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5' />
                        </button>
                    </div>
                    <div className="chat-messages">
                        {messages.map((msg, i) => (
                            <div key={i} className={`message ${msg.role}`}>
                                {msg.content}
                            </div>
                        ))}
                        {loading && <div className="message assistant">Thinking...</div>}
                    </div>
                    <input
                        type="text"
                        placeholder="Ask a question..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                        className={`p-2 text-sm outline-none border-t-[1px] border-t-slate-300 ${loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                    />
                </div>
            )}
        </>

    );
};

export default Chatbot;
