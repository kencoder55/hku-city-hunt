"use client";
import { createTheme } from "@mui/material/styles";
import { getThemeByLocale } from "./option.jsx";

// based on locale, create a MUI theme
export function createThemeByLocale(locale) {
  return createTheme(getThemeByLocale(locale));
}

// default theme
import option from "./option.jsx";
export default createTheme(option);
