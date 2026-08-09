/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        char: {
          950: "#141210",
          900: "#1c1916",
          800: "#26221d",
          700: "#37312a",
          400: "#8a8175",
          200: "#e5ddd0",
        },
        paper: "#efe8d8",
        rust: {
          500: "#c1502e",
          600: "#a8422a",
        },
        okra: {
          400: "#8fa876",
          600: "#5f7a45",
        },
        sand: "#e9e2d6",
      },
      fontFamily: {
        display: ["'Barlow Condensed'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
}

