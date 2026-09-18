import axios from 'axios';
import { defineConfig, loadEnv } from 'vite'


  const env = loadEnv(mode, process.cwd(), '')
  

const api = axios.create({
    baseURL: "https://complaint-box-delta.vercel.app/api" || env.VITE_FRONTEND_URI  ,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})

export default api;