/** @type {import("postcss-load-config").Config} */
export const sharedConfig = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {}),
  },
};

export default sharedConfig;
