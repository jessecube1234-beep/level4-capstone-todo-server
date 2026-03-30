import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "./src"),
      "@tests": path.resolve(process.cwd(), "./tests")
    }
  },
  test: {
    include: ["tests/**/*.{test,spec}.{js,jsx}"],
    environment: "jsdom",
    setupFiles: "./tests/setup.js"
  }
});
