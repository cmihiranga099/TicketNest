/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#f2f0ec",
        paper: "#0b0f14",
        accent: "#f0683f",
        "accent-2": "#1c6b5a",
        muted: "#aeb3bd",
        card: "#151b24"
      },
      boxShadow: {
        soft: "0 20px 40px rgba(5, 8, 12, 0.45)"
      }
    }
  },
  plugins: []
};
