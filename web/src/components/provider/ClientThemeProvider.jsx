"use client";

import { createThemeByLocale } from "@/styles/theme";
import { ThemeProvider } from "@mui/material/styles";

export default function ClientThemeProvider({ locale, children }) {
  const theme = createThemeByLocale(locale);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
