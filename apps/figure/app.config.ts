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
    preset: "vercel",
    esbuild: {
      options: {
        target: ["esnext"],
      },
    },
    future: { nativeSWR: true },
  },
});
