import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        outDir: "../server/public",
    },
    plugins: [react()],
    server: {
        proxy: {
            "/api": { target: "http://localhost:3000", changeOrigin: true },
        },
    },
});
