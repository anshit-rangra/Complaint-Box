import axios from 'axios';
import { defineConfig, loadEnv } from 'vite'


  const env = loadEnv(mode, process.cwd(), '')
  console.log(env.VITE_FRONTEND_URI)

const api = axios.create({
    baseURL: env.VITE_FRONTEND_URI  || "https://complaint-box-delta.vercel.app/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})

export default api;