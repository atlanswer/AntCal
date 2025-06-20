import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import solid from "@astrojs/solid-js";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeExternalLinks from "rehype-external-links";

// https://astro.build/config
export default defineConfig({
  site: "https://antcal.atlanswer.com",
  integrations: [solid()],
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
          target: "_blank",
          rel: ["noopener"],
          content: { type: "text", value: " ↗" },
        },
      ],
    ],
  },
  experimental: {
    contentIntellisense: true,
    clientPrerender: true,
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
