/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: "#875cf5",
      },
      screens: {
        "3xl": "1920px",
      },
    },
  },
  plugins: [],
};
