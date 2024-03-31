import typography from "@tailwindcss/typography";

/** @type {Partial<import('tailwindcss').Config>} */
export const sharedConfig = {
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [typography],
};

export default sharedConfig;
