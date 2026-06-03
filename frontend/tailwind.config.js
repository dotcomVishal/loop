/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        loop: {
          black: "#09080f",
          panel: "#14101f",
          purple: "#b894ff",
          purpleSoft: "#6d52a8",
          text: "#f0eaff"
        }
      }
    }
  },
  plugins: []
};