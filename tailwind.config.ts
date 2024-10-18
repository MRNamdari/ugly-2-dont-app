import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: "#eff5f6",
          100: "#cee0e3",
          200: "#aeccd1",
          300: "#8db7bf",
          400: "#6ca3ac",
          500: "#538993",
          600: "#406b72",
          700: "#2e4c51",
          800: "#1c2e31",
          900: "#090f10",
        },
        secondary: {
          50: "#ebf8f9",
          100: "#c3e9ee",
          200: "#9bdbe3",
          300: "#73ccd8",
          400: "#4bbecd",
          500: "#32a4b4",
          600: "#27808c",
          700: "#1c5b64",
          800: "#11373c",
          900: "#061214",
        },
        error: {
          50: "#f6eeee",
          100: "#e5cccc",
          200: "#d4abab",
          300: "#c28989",
          400: "#b16767",
          500: "#984e4e",
          600: "#763d3d",
          700: "#542b2b",
          800: "#331a1a",
          900: "#110909",
        },
        warning: {
          50: "#f7f5ee",
          100: "#e6e2cb",
          200: "#d6cea9",
          300: "#c5ba86",
          400: "#b5a764",
          500: "#9b8d4a",
          600: "#796e3a",
          700: "#564f29",
          800: "#342f19",
          900: "#111008",
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents, theme }) {
      const sizes = ["sm", "md", "lg", "xl"];
      const styles = ["solid", "outline", "text"];
      const colors = theme("colors") as any;
      const menu = {};
      Object.keys(colors).forEach((name) => {
        if (typeof colors[name] == "string") {
          Object.assign(menu, {
            [`.menu-item-${name}`]: { backgroundColor: colors[name] },
            [`.menu-${name}`]: {
              backgroundColor: colors[name],
            },
          });
        } else {
          Object.keys(colors[name]).forEach((code) => {
            Object.assign(menu, {
              [`.menu-item-${name}-${code}`]: {
                backgroundColor: colors[name][code],
              },
              [`.menu-${name}-${code}`]: {
                backgroundColor: colors[name][code],
              },
            });
          });
        }
      });

      const overlay = {
        ".overlay": {
          width: "100%",
          height: "100%",
          position: "absolute",
          inset: "0",
        },
      };

      addComponents({ ...overlay, ...menu });
    }),
  ],
};
export default config;
