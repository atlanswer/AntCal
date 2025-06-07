import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeExternalLinks from "rehype-external-links";

// https://astro.build/config
export default defineConfig({
  site: "https://antcal.atlanswer.com",
  vite: {
    plugins: [tailwindcss()],
  },
  prefetch: {
    prefetchAll: true,
  },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      rehypeKatex,
      [
        rehypeExternalLinks,
        {
          rel: ["noopener", "noreferrer"],
          target: "_blank",
          content: { type: "text", value: " ↗" },
        },
      ],
    ],
  },
  experimental: {
    fonts: [
      {
        name: "Geist Sans",
        provider: "local",
        cssVariable: "--font-geist-sans",
        variants: [
          {
            weight: "100 900",
            src: [
              "../../node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2",
            ],
          },
        ],
        fallbacks: [
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      {
        name: "Geist",
        provider: "local",
        cssVariable: "--font-geist-mono",
        variants: [
          {
            weight: "100 900",
            src: [
              "../../node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2",
            ],
          },
        ],
        fallbacks: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
    ],
  },
});
