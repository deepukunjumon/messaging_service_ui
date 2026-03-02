import { theme } from "./src/styles/theme";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: theme.brand.primary,
          bg: theme.brand.bg,
        },
      },
    },
  },
};
