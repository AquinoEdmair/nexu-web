import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "on-tertiary-container": "#776300",
        "surface-bright": "#37393e",
        "secondary": "#bfc7d1",
        "secondary-fixed-dim": "#bfc7d1",
        "secondary-fixed": "#dbe3ed",
        "surface-tint": "#00dddd",
        "on-tertiary": "#3a3000",
        "on-primary-container": "#007070",
        "inverse-surface": "#e2e2e8",
        "on-secondary": "#293139",
        "on-error": "#690005",
        "primary": {
          DEFAULT: "#ffffff",
          "400": "#26ffff",
          "500": "#00fbfb",
          "600": "#00cccc",
        },
        "nexus": {
          "cyan": "#0B40C1",
          "blue": "#0B40C1",
          "blue-light": "#1888F3",
          "dark": "#0b1118",
          "card": "rgba(17, 28, 41, 0.7)",
          "text": "#a0aec0",
        },
        "on-primary-fixed": "#002020",
        "surface-variant": "#333539",
        "error": "#ffb4ab",
        "primary-container": "#00fbfb",
        "inverse-on-surface": "#2f3035",
        "on-secondary-fixed": "#141c23",
        "on-surface": "#e2e2e8",
        "on-secondary-fixed-variant": "#404850",
        "on-secondary-container": "#b1b9c3",
        "surface": "#111318",
        "surface-container-lowest": "#0c0e12",
        "on-background": "#e2e2e8",
        "outline": "#839493",
        "tertiary-fixed": "#ffe16d",
        "surface-container": "#1e2024",
        "on-primary": "#003737",
        "error-container": "#93000a",
        "on-tertiary-fixed-variant": "#544600",
        "primary-fixed-dim": "#00dddd",
        "primary-fixed": "#00fbfb",
        "tertiary-container": "#ffe16d",
        "surface-dim": "#111318",
        "surface-container-low": "#1a1c20",
        "background": "#111318",
        "tertiary-fixed-dim": "#e9c400",
        "secondary-container": "#424a52",
        "on-primary-fixed-variant": "#004f4f",
        "on-error-container": "#ffdad6",
        "outline-variant": "#3a4a49",
        "surface-container-highest": "#333539",
        "on-surface-variant": "#b9cac9",
        "on-tertiary-fixed": "#221b00",
        "tertiary": "#ffffff",
        "surface-container-high": "#282a2e",
        "inverse-primary": "#006a6a"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      fontFamily: {
        "headline": ["var(--font-manrope)"],
        "body": ["var(--font-manrope)"],
        "label": ["var(--font-manrope)"]
      }
    },
  },
  plugins: [],
};
export default config;
