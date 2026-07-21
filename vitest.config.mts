import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// reproduit un navigateur léger pour tester les composants React
export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
  },
});
