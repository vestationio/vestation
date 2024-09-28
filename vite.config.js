import { defineConfig } from "vite";
import cssnano from "cssnano";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000
  },
  plugins: [
    nodePolyfills(),
    react(),
    svgr({
      include: "./src/assets/**/*.svg?react",
      svgrOptions: {
        dimensions: false,
        plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"]
      }
    })
  ],
  css: {
    postcss: {
      plugins: [
        cssnano({
          preset: ["cssnano-preset-advanced", {}]
        })
      ]
    },
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
        additionalData: `@use "~/styles/common" as *;`
      }
    }
  },
  resolve: {
    alias: [{ find: "~", replacement: "/src" }]
  }
});
