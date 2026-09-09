import { createTheme } from "@mui/material/styles";

const defaultTheme = createTheme();
const {
  breakpoints,
  typography: { pxToRem },
} = defaultTheme;

const baseTypography = {
  fontFamily: "'Chiron GoRound TC', sans-serif",

  h1: {
    fontSize: pxToRem(60),
    fontWeight: 900,
    lineHeight: 68 / 60,
  },
  h2: {
    fontSize: pxToRem(48),
    fontWeight: 800,
    lineHeight: 54 / 48,
    letterSpacing: "-0.48px",
  },
  h3: {
    fontSize: pxToRem(40),
    fontWeight: 500,
    lineHeight: 43 / 40,
    letterSpacing: "-0.8px",
  },
  h4: {
    fontSize: pxToRem(32),
    fontWeight: 500,
    lineHeight: 36 / 32,
    letterSpacing: "-0.32px",
  },
  h5: {
    fontSize: pxToRem(24),
    fontWeight: 800,
    lineHeight: 28 / 24,
    letterSpacing: "0.48px",
  },
  h6: {
    fontSize: pxToRem(20),
    fontWeight: 500,
    lineHeight: 24 / 20,
  },
  body1: {
    fontSize: pxToRem(16),
    fontWeight: 400,
    lineHeight: 20 / 16,
    letterSpacing: "0.64px",
  },
  body2: {
    fontSize: pxToRem(12),
    fontWeight: 400,
    lineHeight: 16 / 12,
    letterSpacing: "0.24px",
  },
  subtitle1: {
    fontSize: pxToRem(10),
    fontWeight: 400,
    lineHeight: 14 / 10,
    letterSpacing: "0.1px",
  },
  button: {
    fontSize: pxToRem(16),
    fontWeight: 500,
    lineHeight: 20 / 16,
  },
};

export function getTypography(locale) {
  if (locale === "en") {
    return {
      ...baseTypography,
      fontFamily: "'Rounded Mplus 1c', sans-serif",
      h1: {
        ...baseTypography.h1,
        letterSpacing: "0.6px",
      },
      h2: {
        ...baseTypography.h2,
        fontWeight: 700,
      },
      h3: {
        ...baseTypography.h3,
        fontWeight: 600,
        lineHeight: 1.3,
        letterSpacing: "-0.2px",
      },
      h4: {
        ...baseTypography.h4,
        fontWeight: 600,
        lineHeight: 1.4,
        letterSpacing: "0.8px",
      },
      h5: {
        ...baseTypography.h5,
        fontWeight: 700,
        letterSpacing: "0.24px",
      },
      h6: {
        ...baseTypography.h6,
        fontWeight: 700,
        lineHeight: 20 / 20,
        letterSpacing: undefined,
      },
      body1: {
        ...baseTypography.body1,
        letterSpacing: undefined,
      },
      body2: {
        ...baseTypography.body2,
        lineHeight: 15 / 12,
        letterSpacing: undefined,
      },
      subtitle1: {
        ...baseTypography.subtitle1,
        lineHeight: 13 / 10,
        letterSpacing: undefined,
      },
    };
  }

  return baseTypography;
}

// default to Traditional Chinese
const typography = getTypography("zh-HK");

export default typography;
