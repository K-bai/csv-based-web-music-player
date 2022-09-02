import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue2";
import Components from "unplugin-vue-components/vite";
import { ElementUiResolver } from "unplugin-vue-components/resolvers";
import url from 'postcss-url';
import image from '@rollup/plugin-image';
const path = require("path");

svg_loader = image({include: ['**/*.svg']})
svg_loader.enforce = "pre"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svg_loader,
    Components({
      resolvers: [
        ElementUiResolver({
          importStyle: "css",
        }),
      ],
      dts: "src/components.d.ts",
    }),
  ],
  css: {
    postcss: {
      plugins: [
        url([
          {filter: "**/*.svg", url: (asset) => {
            if (asset.url.substring(0, 1) === "@") return "/src" + asset.url.substring(1);
          }},
        ]),
        url([{filter: "**/*.svg", url: "inline", basePath: __dirname}]),
      ]
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      },
    }
  }
});
