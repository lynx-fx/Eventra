import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Adjust if your backend runs on a different port
});

// Interceptor to add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Assuming you store token in localStorage
        if (token) {
            config.headers.auth = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
