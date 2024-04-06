import { defineConfig } from "@solidjs/start/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  vite: {
    build: {
      target: ["esnext"],
    },
    plugins: [tsconfigPaths()],
    assetsInclude: ["@/pyodide/**"],
    worker: {
      format: "es",
      plugins: () => [tsconfigPaths()],
      rollupOptions: {
        external: ["@/pyodide"],
      },
    },
  },
  server: {
    esbuild: {
      options: {
        target: ["esnext"],
      },
    },
    preset: "vercel-static",
    future: { nativeSWR: true },
    prerender: { crawlLinks: true },
  },
});
