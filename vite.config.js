import { defineConfig } from "vite";
import cssnano from "cssnano";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000
  },
  plugins: [
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
        additionalData: `@use "~/styles/common" as *;`
      }
    }
  },
  resolve: {
    alias: [{ find: "~", replacement: "/src" }]
  }
});
