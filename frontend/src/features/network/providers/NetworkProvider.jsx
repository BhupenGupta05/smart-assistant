import useNetworkStatus from "../hooks/useNetworkStatus";
import { NetworkContext } from "./NetworkContext";

export default function NetworkProvider({ children }) {
  const isOnline = useNetworkStatus();

  return (
    <NetworkContext.Provider value={isOnline}>
      {children}
    </NetworkContext.Provider>
  );
}
