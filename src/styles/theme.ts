const primary = {
  DEFAULT: "#1597BB",
  light: "#1597BB",
  dark: "#1597BB",
};

const secondary = `${primary.DEFAULT}2F`;

const background = {
  light: "#F8FAFC",
  dark: "#000000",
};

const surface = {
  light: "#FFFFFF",
  dark: "#000000",
};

const text = {
  primary: "#0F172A",
  dark: "#F1F5F9",
  muted: "#64748B",
};

const border = {
  light: "#E2E8F0",
  dark: "#1E293B",
};

export const theme = {
  brand: {
    primary,
    secondary,
    background,
    surface,
    text,
    border,

    header: {
      light: surface.light,
      dark: surface.dark,
    },
  },
};