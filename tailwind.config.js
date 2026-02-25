/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // important
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0d9488", // teal-600
          light: "#14b8a6", // teal-500
          dark: "#0f766e", // teal-700
        },
      },
    },
  },
  plugins: [],
};
