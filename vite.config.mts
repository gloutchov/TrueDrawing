import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Explicit ESM config keeps Vite native loading compatible with our CommonJS Electron entry.

export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist/renderer",
    emptyOutDir: true
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true
  }
});
