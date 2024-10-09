import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
    root: './', // Vite will serve files from the 'src' folder
    server: {
        port: 3000, // You can set a custom port here if you want
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
    },
})
