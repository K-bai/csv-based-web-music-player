import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";
import vue from "@vitejs/plugin-vue2";
const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), viteCompression()],
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      stream: "stream-browserify",
      process: "process/browser",
    },
  },
});
