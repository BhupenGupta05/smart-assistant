export const getAqiColor = (aqi) => {
  if (aqi <= 50) return "text-emerald-500";
  if (aqi <= 100) return "text-lime-500";
  if (aqi <= 200) return "text-yellow-500";
  if (aqi <= 300) return "text-orange-500";
  if (aqi <= 400) return "text-red-500";
  return "text-purple-600";
};


export const getAqiLabel = (aqi) => {
  if (aqi == null) return "Unknown";

  if (aqi <= 50) return "Clean";
  if (aqi <= 100) return "Acceptable";
  if (aqi <= 150) return "Unhealthy (Sensitive)";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  if (aqi <= 400) return "Hazardous";
  return "Emergency";
};



export const getAqiBg = (aqi) => {
  if (aqi <= 50) return "bg-emerald-50 dark:bg-emerald-900/20";
  if (aqi <= 100) return "bg-lime-50 dark:bg-lime-900/20";
  if (aqi <= 200) return "bg-yellow-50 dark:bg-yellow-900/20";
  if (aqi <= 300) return "bg-orange-50 dark:bg-orange-900/20";
  if (aqi <= 400) return "bg-red-50 dark:bg-red-900/20";
  return "bg-purple-50 dark:bg-purple-900/20";
};
