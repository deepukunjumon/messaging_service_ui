const primary = {
  DEFAULT: "#09637E", // Deep Teal
  light: "#088395",
  dark: "#074d61", // Darkened for hover states
};

export const theme = {
  brand: {
    primary,
    // Using B3 for ~70% opacity and 1A for ~10%
    secondary: `${primary.DEFAULT}B3`,

    background: {
      light: "#F8FAFC", // Slightly off-white reduces eye strain
      dark: "#0B1219", // Deepest layer
    },

    surface: {
      light: "#FFFFFF", // Cards sit on top of background
      dark: "#15202B", // Lighter than background to show elevation
    },

    text: {
      primary: "#0F172A", // Slate 900 for Light Mode
      dark: "#F1F5F9", // Slate 100 for Dark Mode (Readable!)
      muted: "#64748B",
    },

    border: {
      light: "#E2E8F0",
      dark: "#1E293B",
    },

    header: {
      light: "#FFFFFF",
      dark: "#0F1724",
    },
  },
};
