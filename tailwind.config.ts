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
          light: "#FFFFFF", // Figma "White" for clean look
          dark: "#121223",  // Figma Dark Blue/Black
        },
        surface: {
          light: "#F7F8F9", // Light Gray surface
          dark: "#1F1F30",
        },
        text: {
          main: "#111A2C", // Figma Dark Navy
          secondary: "#525C67", // Figma Slate Gray
        },
        // Accent for scanner circle
        cyan: {
          soft: "#A3D8D8", // Soft Teal (Updated)
          dark: "#1A3C40", // Dark Teal for icons
        }
      },
      fontFamily: {
        // Google Font: Sen as primary, Space Grotesk as accent/display if needed
        sans: ["var(--font-sen)", "sans-serif"],
        display: ["var(--font-space-grotesk)", "sans-serif"],
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