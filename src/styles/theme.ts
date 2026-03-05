const primary = {
  DEFAULT: "#026151",
  light: "#026151",
  dark: "#0796e3",
};

const secondary = {
  light: `${primary.light}2F`,
  dark: `${primary.dark}2F`,
};

const background = {
  light: "#F8FAFC",
  dark: "#000000",
};

const surface = {
  light: "#FFFFFF",
  dark: "#030d1c",
};

const text = {
  primary: "#0F172A",
  dark: "#F1F5F9",
  muted: "#64748B",
};

const border = {
  light: "#E2E8F0",
  dark: "#07152c",
};

const button = {
  success: "#439121",
  delete: "#ad1c17",
};

const toggle = {
  turned_on: "#06923E",
  turned_off: "#d1d5db",
};

const toast = {
  success: "#246b0f",
  error: "#c71423",
  warning: "#e6510b",
  info: "#1792ad",
  default: primary.DEFAULT,
};

export const theme = {
  brand: {
    primary,
    secondary,
    background,
    surface,
    text,
    button,
    toggle,
    toast,
    border,

    header: {
      light: surface.light,
      dark: surface.dark,
    },
  },
};
