import axios from 'axios';

const api = axios.create({
    baseURL:"https://complaint-box-delta.vercel.app/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})

export default api;