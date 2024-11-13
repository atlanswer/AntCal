import sharedConfig from "@antcal/tailwind-config";

/** @type {import("@antcal/tailwind-config").Config} */
export default {
  content: ["./src/**/*.{tsx,ts,css,md}"],
  presets: [sharedConfig],
  theme: {
    fontFamily: {
      "saira-condensed": "Saira Condensed",
      "saira-extra-condensed": "Saira Extra Condensed",
    },
  },
};
