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
      menuStyles: { filled: 0, outlined: 1 },
      menuSizes: {
        sm: { height: "2rem", radius: "1rem", gap: ".5rem", fontSize: "sm" },
        md: {
          height: "2.5rem",
          radius: "1.25rem",
          gap: ".75rem",
          fontSize: "base",
        },
        lg: { height: "3rem", radius: "1.5rem", gap: "1rem", fontSize: "lg" },
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents, matchComponents, theme }) {
      const clr = theme("colors") as any;
      const color: Record<string, string> = {};
      Object.keys(clr).forEach((name) => {
        if (typeof clr[name] == "string") {
          color[name] = clr[name];
        } else {
          Object.keys(clr[name]).forEach((code) => {
            color[`${name}-${code}`] = clr[name][code];
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

      addComponents({ ...overlay });
      // menu, menu-item colors
      matchComponents(
        {
          menu: (value) => ({
            "--ug-clr": value,
          }),
          "menu-item": (value) => ({
            "--ug-clr": value,
          }),
          tap: (value) => ({
            "--fm-clr": value,
          }),
        },
        { values: color }
      );
      // menu sizes
      matchComponents(
        {
          menu: (value) => ({
            fontSize: theme("fontSize." + value.fontSize),
            "& .menu-button,& .menu-item": {
              height: value.height,
              paddingInline: value.gap,
              gap: value.gap,
            },
            "& .menu-button,& .menu-list-wrapper": {
              borderRadius: value.radius,
            },
            "&[aria-expanded=true] .menu-list-wrapper": {
              marginTop: value.gap,
            },
          }),
        },
        { values: theme("menuSizes") }
      );
      // menu styles
      matchComponents(
        {
          menu: (value) => {
            switch (value) {
              case 0:
                return {
                  "& .menu-button, & .menu-item": {
                    backgroundColor: "var(--ug-clr)",
                  },
                };
              case 1:
                return {
                  "& .menu-button,& .menu-list-wrapper": {
                    border: "2px solid var(--ug-clr)",
                  },
                  "& .menu-item:not(:last-child)": {
                    borderBottom: "2px solid var(--ug-clr)",
                  },
                };
            }
            return {} as any;
          },
        },
        { values: theme("menuStyles") }
      );
    }),
  ],
};
export default config;
