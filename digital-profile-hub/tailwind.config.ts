import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // MyWebLink Specific Colors
        brand: {
          dark: "#050B1A",    // Deep Obsidian Navy
          gold: "#D4AF37",    // Executive Gold
          accent: "#F8E391",  // Shimmering Light Gold
          muted: "#B8860B",   // Deep Bronze Gold
        },
        primary: {
          DEFAULT: "#D4AF37", // Setting Gold as Primary
          foreground: "#050B1A",
        },
        secondary: {
          DEFAULT: "#0A1225",
          foreground: "#F8E391",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#F8E391",
          foreground: "#050B1A",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "#050B1A",
          foreground: "#F8E391",
          primary: "#D4AF37",
          "primary-foreground": "#050B1A",
          accent: "rgba(212, 175, 55, 0.1)",
          "accent-foreground": "#D4AF37",
          border: "rgba(212, 175, 55, 0.2)",
          ring: "#D4AF37",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        // Create metallic text/button gradients
        "gold-gradient": "linear-gradient(135deg, #D4AF37 0%, #F8E391 50%, #B8860B 100%)",
        "dark-glass": "linear-gradient(to bottom, rgba(10, 18, 37, 0.8), rgba(5, 11, 26, 0.95))",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "shimmer": {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "shimmer": "shimmer 2s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;