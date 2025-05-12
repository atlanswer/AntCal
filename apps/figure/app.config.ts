import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  vite: {
    build: {
      target: ["esnext"],
    },
    plugins: [tsconfigPaths(), tailwindcss()],
  },
  server: {
    esbuild: {
      options: {
        target: ["esnext"],
      },
    },
    preset: "vercel-static",
    future: { nativeSWR: true },
    prerender: {
      routes: ["/", "/report", "/docs", "/about"],
      crawlLinks: true,
    },
  },
});
