/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

const fallbackFonts = [
  "ui-sans-serif",
  "system-ui",
  "-apple-system",
  "BlinkMacSystemFont",
  "Segoe UI",
  "Roboto",
  "Helvetica Neue",
  "Arial",
  "Noto Sans",
  "sans-serif",
  "Apple Color Emoji",
  "Segoe UI Emoji",
  "Segoe UI Symbol",
  "Noto Color Emoji",
];

module.exports = {
  darkMode: ["class", '[data-applied-mode="dark"]'],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["National", ...fallbackFonts],
        headline: ["National", ...fallbackFonts],
        serif: ["serif"],
        mono: ["monospace"],
      },
      colors: {
        brandPink: "var(--brand-pink)",
        brandBlue: "var(--brand-blue)",
        brandBlack: "var(--brand-black)",
        background: "var(--background)",
        text: "var(--text)",
        border: "var(--border)",
        discrete: "var(--discrete)",
      },
      height: { screen: "100lvh" },
      width: { screen: "100lvw" },
      screens: {
        xs: "420px",
      },
      transitionTimingFunction: {
        "out-extreme": "cubic-bezier(.12,.98,.13,.98)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/container-queries"),
    require("tailwindcss-touch")(),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".text-balance": {
          "text-wrap": "balance",
        },
      });
    }),
  ],
};
