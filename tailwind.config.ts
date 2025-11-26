import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // New Palette based on Design Specs
        primary: "#13ec5b", // Neon Green
        "primary-dark": "#0fb845",
        background: {
          light: "#F2F9F5", // Light Mint (Updated)
          dark: "#102216",  // Deep Green/Black
        },
        surface: {
          light: "#FFFFFF",
          dark: "#182E21",
        },
        text: {
          main: "#0D1F2D", // Dark Blue/Green (Updated)
          secondary: "#5A6B7C", // Muted Blue/Gray
        },
        // Accent for scanner circle
        cyan: {
          soft: "#A3D8D8", // Soft Teal (Updated)
          dark: "#1A3C40", // Dark Teal for icons
        }
      },
      fontFamily: {
        // Google Font: Space Grotesk
        sans: ["Space Grotesk", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;