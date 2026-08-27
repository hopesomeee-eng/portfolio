import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import Sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://sushant-kumar.pages.dev',
      dynamicRoutes: ['/']
    }),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Sushant Kumar | Full Stack & Agentic AI Engineer',
        short_name: 'Sushant',
        description: 'Portfolio of Sushant Kumar, a Senior Software Engineer specializing in scalable Full-Stack architectures, Mobile App Development (Flutter), and Agentic AI (MCP/LangChain).',
        theme_color: '#09090b',
        background_color: '#09090b',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // Cache all essential files for offline mode
        globPatterns: ['**/*.{js,css,html,ico,png,svg,glb,wasm}']
      }
    })
  ],
  server: {
    headers: {
      // Required for SharedArrayBuffer to enable Multithreaded WASM (Jolt Physics)
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    }
  },
  preview: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    }
  },
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        // Ignore sourcemap warnings from third-party libraries like framer-motion
        if (warning.code === 'SOURCEMAP_ERROR') return
        defaultHandler(warning)
      }
    }
  }
})
