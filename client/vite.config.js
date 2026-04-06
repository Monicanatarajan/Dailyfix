import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            '/api': 'http://localhost:5001'
        }
    },
    define: {
        // Makes VITE_API_URL available as import.meta.env.VITE_API_URL
        // Set this in Render's frontend environment variables
    }
})
