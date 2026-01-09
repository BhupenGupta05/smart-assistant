const PM25_BREAKPOINTS = [
  { cLow: 0.0,   cHigh: 12.0,  aqiLow: 0,   aqiHigh: 50 },
  { cLow: 12.1,  cHigh: 35.4,  aqiLow: 51,  aqiHigh: 100 },
  { cLow: 35.5,  cHigh: 55.4,  aqiLow: 101, aqiHigh: 150 },
  { cLow: 55.5,  cHigh: 150.4, aqiLow: 151, aqiHigh: 200 },
  { cLow: 150.5, cHigh: 250.4, aqiLow: 201, aqiHigh: 300 },
  { cLow: 250.5, cHigh: 350.4, aqiLow: 301, aqiHigh: 400 },
  { cLow: 350.5, cHigh: 500.4, aqiLow: 401, aqiHigh: 500 }
];


function calculateAQI(pm25) {
  const bp = PM25_BREAKPOINTS.find(
    b => pm25 >= b.cLow && pm25 <= b.cHigh
  );

  if (!bp) return null;

  const { cLow, cHigh, aqiLow, aqiHigh } = bp;

  return Math.round(
    ((aqiHigh - aqiLow) / (cHigh - cLow)) * (pm25 - cLow) + aqiLow
  );
}

module.exports = {calculateAQI}
