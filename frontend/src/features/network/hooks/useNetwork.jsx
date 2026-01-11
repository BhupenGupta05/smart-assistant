import { useContext } from "react";
import { NetworkContext } from "../providers/NetworkContext";

export default function useNetwork() {
  const ctx = useContext(NetworkContext);
  if (ctx === undefined) {
    throw new Error("useNetwork must be used inside NetworkProvider");
  }
  return ctx;
}
