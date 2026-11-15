import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff1f1",
          100: "#ffdfdf",
          200: "#ffc5c5",
          300: "#ff9d9d",
          400: "#f86565",
          500: "#E5322D",
          600: "#d3221e",
          700: "#b11a16",
          800: "#921a17",
          900: "#791c19",
          DEFAULT: "#E5322D",
        },
      },
    },
  },
  plugins: [],
};
export default config;
