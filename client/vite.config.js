import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  console.log("Backend ", env.VITE_BACKEND_URI)
  return {
    plugins: [react(), tailwindcss()],

    server: {
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URI || "https://complaint-box-dwov.onrender.com/",
        }
      }
    }
  }
})