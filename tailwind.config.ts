import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FAF9F6",
        court: { DEFAULT: "#184332", light: "#E7EEEA" },
        lawn: { DEFAULT: "#A7C957", light: "#EEF4DF" },
        ink: { DEFAULT: "#2D2D2D", muted: "#6B6B6B" },
        line: "#E8E5DE",
      },
      fontFamily: {
        serif: ['"Playfair Display"', "serif"],
        sans: ['"Noto Sans JP"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
