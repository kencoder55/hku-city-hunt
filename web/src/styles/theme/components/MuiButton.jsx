import palette from "../palette.jsx";
import typography from "../typography.jsx";

const Element = {
  styleOverrides: {
    root: {
      borderRadius: "64px",
      textTransform: "none",
      boxShadow: "none",
      textTransform: "none",
      fontFamily: typography.fontFamily,
      fontSize: typography.button.fontSize,
      fontWeight: typography.button.fontWeight,
      lineHeight: typography.button.lineHeight,
      color: palette.primary.contrastText,

      "&:hover": {
        boxShadow: "none",
      },
    },
    // Size variants
    sizeSmall: {
      padding: "6px 14px",
      fontSize: "0.975rem",
    },
    sizeMedium: {
      padding: "10px 26px",
      fontSize: "1.1rem",
    },
    sizeLarge: {
      padding: "14px 30px",
      fontSize: "1.245rem",
    },
    // Contained Button
    contained: {
      backgroundColor: palette.primary.main,
      border: `2px solid ${palette.primary.main}`,
      boxShadow: "inset 0 0 0 2px white",

      "&:hover": {
        // primary 300
        backgroundColor: palette.primary.light,
        border: `2px solid ${palette.primary.light}`,
        boxShadow: "inset 0 0 0 2px white",
      },
      "&:focus": {
        backgroundColor: palette.primary.dark,
        border: `2px solid ${palette.primary.dark}`,
        boxShadow: "inset 0 0 0 2px white",
      },
      "&.Mui-disabled": {
        backgroundColor: palette.colors.disabled,
        border: `2px solid ${palette.colors.disabled}`,
        boxShadow: "inset 0 0 0 2px white",
      },
    },
    // Outlined Button
    outlined: {
      border: `2px solid ${palette.primary.main}`,
      backgroundColor: "transparent",
      color: palette.primary.main,
      outline: `2px solid ${palette.primary.main}`,
      outlineOffset: "-6px",

      "&:hover": {
        backgroundColor: palette.primary.light,
      },
      "&:focus": {
        backgroundColor: palette.primary.dark,
      },
      "&.Mui-disabled": {
        border: `2px solid ${palette.colors.disabled}`,
        backgroundColor: "transparent",
        outline: `2px solid ${palette.colors.disabled}`,
      },
    },
    // Text Button
    text: {
      border: "2px solid transparent",
      backgroundColor: "transparent",
      color: palette.primary.main,
    },
    secondary: {
      border: `2px solid ${palette.primary.main}`,
      backgroundColor: "#F6F6F6",
      color: palette.primary.main,
      outline: `2px solid ${palette.primary.main}`,
      outlineOffset: "-6px",

      "&:hover": {
        backgroundColor: palette.primary.light,
      },
      "&:focus": {
        backgroundColor: palette.primary.dark,
      },
      "&.Mui-disabled": {
        border: `2px solid ${palette.colors.disabled}`,
        backgroundColor: "transparent",
        outline: `2px solid ${palette.colors.disabled}`,
      },
    },
  },
};

export default Element;
