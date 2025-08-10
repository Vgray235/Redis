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
    outDir: path.resolve(__dirname, '../backend/dist'),
    emptyOutDir: true
  },
  server: {
    // during dev, proxy /api to backend dev server
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
});