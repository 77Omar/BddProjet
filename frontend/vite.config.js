import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: ['**/*.js', '**/*.jsx'], // Traite aussi les .js comme JSX
    }),
  ],
  define: {
    'process.env': process.env,
  },
})