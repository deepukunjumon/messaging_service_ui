import { theme } from "./src/styles/theme";

export default {
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
