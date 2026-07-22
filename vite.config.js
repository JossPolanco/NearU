import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    plugins: [react(), basicSsl()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    base: '/NearU',
    build: {
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('@supabase')) {
                            return 'vendor-supabase'
                        }
                        if (id.includes('leaflet') || id.includes('react-leaflet')) {
                            return 'vendor-leaflet'
                        }
                        if (id.includes('react-sketch-canvas') || id.includes('canvas-confetti')) {
                            return 'vendor-canvas'
                        }
                        if (id.includes('lucide-react')) {
                            return 'vendor-icons'
                        }
                        if (id.includes('@tanstack')) {
                            return 'vendor-query'
                        }
                        if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                            return 'vendor-react'
                        }
                    }
                }
            }
        }
    }
})