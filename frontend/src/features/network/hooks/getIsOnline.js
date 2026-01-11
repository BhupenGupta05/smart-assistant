export function getIsOnline() {
  if (typeof navigator === "undefined") return true;
  return navigator.onLine;
}
