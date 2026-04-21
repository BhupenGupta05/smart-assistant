const axios = require('axios');

const axiosInstance = axios.create({
    timeout: 5000,
})

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const err = {
            status: error.response?.status || 500,
            message: 'Request failed',
            context: error.config?.url || 'UNKNOWN_API',
        };

        if (error.code === 'ECONNABORTED') {
            err.status = 408;
            err.message = 'Request timeout';
        } else if (error.response) {
            const status = error.response.status;

            if (status === 429) {
                err.message = 'Upstream rate limit exceeded';
            } else if (status === 401 || status === 403) {
                err.message = 'Invalid or unauthorized API key';
            } else if (status === 404) {
                err.message = 'Resource not found';
            } else if (status >= 500) {
                err.message = 'Upstream service error';
            } else {
                err.message = error.response.data?.error_message || 'Request failed';
            }
        }

        return Promise.reject(err);
    }
);

module.exports = axiosInstance;