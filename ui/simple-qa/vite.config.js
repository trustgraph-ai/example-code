import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/socket': {
        target: 'ws://localhost:8088',
        ws: true,
        rewrite: (path) => path.replace(/^\/api\/socket/, '/api/v1/socket'),
      },
    },
  },
})
