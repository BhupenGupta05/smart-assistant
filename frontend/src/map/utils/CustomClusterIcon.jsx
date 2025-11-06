import L from "leaflet";

export const createClusterCustomIcon = (cluster) => {
  const count = cluster.getChildCount();

  // Colors based on density
  let color = "#76A9FA"; // Blue (low)
  if (count >= 50) color = "#E35D6A"; // Red (high)
  else if (count >= 25) color = "#F7B731"; // Yellow (medium)

  // Outer size scales slightly
  const size = count < 10 ? 40 : count < 50 ? 48 : 56;

  const html = `
    <div style="
      position: relative;
      background: ${color};
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    ">
      <div style="
        background: white;
        width: ${size - 10}px;
        height: ${size - 10}px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        color: #333;
        font-size: 13px;
      ">
        ${count}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: "custom-cluster-icon",
    iconSize: L.point(size, size, true),
  });
};
