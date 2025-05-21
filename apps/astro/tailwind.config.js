import typography from "@tailwindcss/typography";

/** @type {import("tailwindcss").Config} */
export default {
  content: ["./src/**/*.{astro,tsx,ts,md,mdx,css}"],
  darkMode: "class",
  plugins: [typography],
};
