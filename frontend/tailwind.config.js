/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        void: "#050713",
        ink: "#0b1020",
        neon: {
          blue: "#38bdf8",
          cyan: "#22d3ee",
          purple: "#a855f7",
          pink: "#ec4899",
          green: "#34d399",
          red: "#fb7185",
        },
      },
      boxShadow: {
        neon: "0 0 32px rgba(168, 85, 247, 0.45)",
        cyan: "0 0 34px rgba(34, 211, 238, 0.35)",
        pink: "0 0 38px rgba(236, 72, 153, 0.4)",
        panel: "0 24px 80px rgba(0, 0, 0, 0.45)",
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        pulseGlow: "pulseGlow 2.4s ease-in-out infinite",
        scan: "scan 3s linear infinite",
        shimmer: "shimmer 2.8s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) rotateX(0deg)" },
          "50%": { transform: "translateY(-14px) rotateX(3deg)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.55", filter: "blur(18px)" },
          "50%": { opacity: "1", filter: "blur(24px)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(420%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
    },
  },
  plugins: [],
};
