/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Sora'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#f3f1ff",
          100: "#e9e5ff",
          200: "#d5cdff",
          300: "#b6a4ff",
          400: "#9370ff",
          500: "#7c3aed", // primary violet
          600: "#6d28d9",
          700: "#5b21b6",
          800: "#4c1d95",
          900: "#3b1370",
        },
        accent: {
          pink: "#ec4899",
          orange: "#fb923c",
          cyan: "#22d3ee",
          lime: "#a3e635",
        },
        surface: {
          light: "#fbfaff",
          dark: "#0b0a14",
        },
      },
      backgroundImage: {
        "sunset-gradient": "linear-gradient(120deg, #7c3aed 0%, #ec4899 50%, #fb923c 100%)",
        "ocean-gradient": "linear-gradient(120deg, #22d3ee 0%, #7c3aed 100%)",
        "glass-light": "linear-gradient(135deg, rgba(255,255,255,0.65), rgba(255,255,255,0.25))",
        "glass-dark": "linear-gradient(135deg, rgba(20,18,35,0.65), rgba(20,18,35,0.25))",
      },
      boxShadow: {
        glow: "0 8px 40px -8px rgba(124,58,237,0.45)",
        "glow-pink": "0 8px 40px -8px rgba(236,72,153,0.45)",
        glass: "0 8px 32px 0 rgba(31,38,135,0.15)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        blob: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      animation: {
        blob: "blob 8s infinite ease-in-out",
        float: "float 4s ease-in-out infinite",
        shimmer: "shimmer 2.5s infinite linear",
      },
    },
  },
  plugins: [],
};
