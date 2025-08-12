// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
  outDir: 'dist',
  emptyOutDir: true
}
,
  server: {

    "rewrites": [
    { "source": "/api/(.*)", "destination": "https://redis-m04j.onrender.com/api/$1" }
  ],
    // during dev, proxy /api to backend dev server
    proxy: {
      '/api': 'https://redis-m04j.onrender.com'
    }
  }
});