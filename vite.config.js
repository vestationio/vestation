import { defineConfig } from "vite";
import cssnano from "cssnano";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";

let modulesConfig = {
  generateScopedName: "[local]-[hash:base64:4]"
};

if (process.env.IS_PROD) {
  const fileSet = {};
  const hashSet = {};
  modulesConfig = {
    getJSON: function (file, json) {
      if (fileSet[file]) return;

      fileSet[file] = true;
      Object.values(json).forEach((i) => {
        if (hashSet[i]) throw Error("CSS MODULES HASH COLLISION ERROR");
        hashSet[i] = true;
      });
    },
    generateScopedName: "[hash:base64:2]"
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000
  },
  plugins: [
    react(),
    svgr({
      include: "./src/assets/*.svg?react",
      svgrOptions: {
        dimensions: false,
        plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"]
      }
    })
  ],
  css: {
    modules: modulesConfig,
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
