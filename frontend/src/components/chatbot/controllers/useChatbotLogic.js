import { useRef, useState } from "react";
import axios from "axios";
import { useAssistant } from "../../../hooks/useAssistant";
import { useCurrentLocation } from "../../../features/search/hooks/useCurrentLocation";
import useNetwork from "../../../features/network/hooks/useNetwork";

export const useChatbotLogic = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! Ask me anything 🚀" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const chatRef = useRef(null);
  const isOnline = useNetwork();

  const { getCurrentLocation } = useCurrentLocation();

  const {
    searchRef,
    directionsRef,
    setPosition,
    setSelectedPlace,
    setQuery,
    setShowTransitLayer,
    poiIntent,
    onPOIIntent
  } = useAssistant();

  /* ---------------- UI helpers ---------------- */

  const toggleChat = () => setIsOpen(v => !v);

  /* ---------------- Map Actions ---------------- */

  const moveToLocation = async (location) => {
    if (directionsRef.current?.switchToSearchMode) {
      directionsRef.current.switchToSearchMode();
    }

    if (location === "current") {
      const [lat, lng] = await getCurrentLocation();
      setPosition([lat, lng]);
      setSelectedPlace(null);
      return "Moved to current location";
    }

    let success = await searchRef.current?.searchLocationAndSelectFirst(location);

    if (!success && directionsRef.current?.switchToSearchMode) {
      success = await directionsRef.current.searchLocation(location);
    }

    if (!success) {
      throw new Error(`Could not find location: "${location}"`);
    }

    return `Successfully moved to ${location}`;
  };

  const toggleTransit = () => {
    setShowTransitLayer(prev => !prev);
    return "Toggled transit layer";
  };

  /* ---------------- Directions ---------------- */


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

  const setDirections = async ({ origin = "current", destination }) => {
    const dirRef = await waitForRef(directionsRef);
    if (!dirRef) throw new Error("Directions controls not ready");
    if (!destination) throw new Error("Destination is required");

    let success;

    if (origin === "current") {
      const [lat, lng] = await getCurrentLocation();
      success = await dirRef.searchAndSetOrigin("", [lat, lng]);
    } else {
      success = await dirRef.searchAndSetOrigin(origin);
    }

    if (!success) throw new Error("Failed to set origin");

    success = await dirRef.searchAndSetDestination(
      typeof destination === "string" ? destination : destination.name
    );
    if (!success) throw new Error("Failed to set destination");

    dirRef.switchToDirectionsMode();
    await dirRef.calculateDirections();

    return `Directions set from ${origin} to ${destination.name || destination}`;
  };

  /* ---------------- Tool Runner ---------------- */

  const runTool = async (tool, lastUserMessage) => {
    if (!isOnline) {
      throw new Error("You are offline. This action requires internet.");
    }
    const { name, arguments: argsJSON } = tool.function;
    const args = JSON.parse(argsJSON);

    let command = name;

    if (command === "move_to_location" && lastUserMessage.includes("route")) {
      command = "set_directions";
      args.destination = { name: args.location };
    }

    switch (command) {
      case "move_to_location":
        return moveToLocation(args.location);

      case "toggle_transit_layer":
        return toggleTransit();

      case "set_poi_type":
        return onPOIIntent({
          type: args.poi,  
          radius: 1500
        });

      case "search_poi":
        return onPOIIntent({
          type: args.type || args.query,
          query: args.query,
          radius: args.radius ?? 1500
        });

      case "set_directions":
        return setDirections({
          origin: args.origin || "current",
          destination: args.destination
        });

      default:
        throw new Error(`Unknown command: ${command}`);
    }
  };

  /* ---------------- Message Send ---------------- */

  const sendMessage = async () => {
    if (loading || !input.trim()) return;

    if (!isOnline) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "📴 You’re offline. I can’t fetch new answers right now." }
      ]);
      setInput("");
      return;
    }

    const userMessage = { role: "user", content: input };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/chat`,
        { messages: nextMessages }
      );

      if (data.reply) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      }

      if (data.tool_calls?.length) {
        for (const toolCall of data.tool_calls) {
          try {
            const result = await runTool(toolCall, userMessage.content);
            setMessages(prev => [...prev, { role: "assistant", content: `✅ ${result}` }]);
          } catch (err) {
            setMessages(prev => [...prev, { role: "assistant", content: `❌ ${err.message}` }]);
          }
        }
      }

    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ Something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  return {
    // state
    messages,
    input,
    loading,
    isOpen,
    chatRef,

    // setters
    setInput,

    // actions
    toggleChat,
    sendMessage
  };
};
