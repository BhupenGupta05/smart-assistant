const axios = require('axios');

const axiosInstance = axios.create({
    timeout: 5000, // 5 seconds timeout
    validateStatus: (status) => status < 500, // Treat 4xx as valid responses
})

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.code === 'ECONNABORTED') {
            error.message = 'Request timeout';
        }
        return Promise.reject(error);
    }
)

module.exports = axiosInstance;