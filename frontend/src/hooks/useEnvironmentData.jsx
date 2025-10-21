// import { useCallback, useEffect, useState } from "react"
// import axios from "axios"

// export const useEnvironmentData = async () => {
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const fetchData = useCallback(async (lat, lon) => {
//         if (!lat || !lon) return;

//         setLoading(true);
//         setError(null);

//         // USING WITH A PROXY SERVER
//         const url = `${import.meta.env.VITE_BASE_URL}/api/environment?lat=${lat}&lon=${lon}`;

//         try {
//             const { data } = await axios.get(url);

//             if (data !== undefined) {
//                 setData(data);
//             } else {
//                 setData(null);
//                 setError(new Error('Invalid Environment data'));
//             }
//         } catch (error) {
//             console.error("Environment fetch error:", err.message);
//             setError("Failed to load environment data");
//         } finally {
//             setLoading(false);
//         }
//     }, [])

//     useEffect(() => {
//         if (!lat || !lon) return;

//         fetchData();
//         const interval = setInterval(() => {
//             if (error) {
//                 fetchData();
//             }

//         }, 5000);

//         return () => clearInterval(interval);
//     }, [lat, lon, error])

//     // FETCHING FUNCTION SO THAT WE CAN BUILD A LAYER WHICH WILL CALL THIS FUNCTION
//     // TO GET THE DATA WHENEVER IT NEEDS TO
//     return { data, loading, error, fetchData }
// }