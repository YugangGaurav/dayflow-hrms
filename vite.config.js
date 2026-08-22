import { defineConfig } from 'vite'

export default defineConfig({
  // Serve index.html from project root
  root: '.',
  // Build output
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  // Environment variable prefix — only VITE_* vars are exposed to frontend
  envPrefix: 'VITE_',
  server: {
    port: 5173,
    open: true,
  },
})
