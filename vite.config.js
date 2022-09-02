import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";
import { svgLoader } from "./svg";
import vue from "@vitejs/plugin-vue2";
import Components from "unplugin-vue-components/vite";
import { ElementUiResolver } from "unplugin-vue-components/resolvers";
const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteCompression(),
    svgLoader(),
    Components({
      resolvers: [
        ElementUiResolver({
          importStyle: "css",
        }),
      ],
      dts: "src/components.d.ts",
    }),
  ],
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
    },
  },
});
