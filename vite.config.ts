import { defineConfig } from 'vite'

export default defineConfig({
    root: './src', // Vite will serve files from the 'src' folder
    server: {
        port: 3000, // You can set a custom port here if you want
    },
})
