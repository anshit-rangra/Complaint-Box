import axios from 'axios';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_FRONTEND_URI}/api`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

export default api;