import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => ({
  plugins: [
    ...(mode === "test" ? [] : [reactRouter()]),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    setupFiles: "./testSetupFile.ts",
    environment: "jsdom",
    watch: false,
  },
}));