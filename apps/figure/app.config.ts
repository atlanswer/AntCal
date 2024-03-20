import { defineConfig } from "@solidjs/start/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  ssr: false,
  experimental: {
    islands: true,
  },
  vite: {
    plugins: [tsconfigPaths()],
  },
  server: {
    preset: "static",
    prerender: {
      crawlLinks: true,
    },
  },
});
