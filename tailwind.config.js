/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1a73e8",
      },
      boxShadow: {
        card: "0 8px 30px rgba(16, 24, 40, 0.08)",
        pill: "0 4px 16px rgba(26,115,232,0.35)",
      },
      borderRadius: {
        "2xl+": "1.25rem",
      },
    },
  },
  plugins: [],
};
