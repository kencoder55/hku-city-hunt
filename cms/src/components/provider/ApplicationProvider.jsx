import "@/styles/globals.css";
import theme from "@/styles/theme";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import ToastStyledContainer from "../common/ToastStyledContainer";
import StoreProvider from "./StoreProvider";
import { routing } from "@/i18n/routing";
import { CssBaseline } from "@mui/material";

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function ApplicationProvider({ children, params }) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <html lang={locale}>
      <body>
        <AppRouterCacheProvider options={{ key: "css" }}>
          <ThemeProvider theme={theme}>
            <ToastStyledContainer />
            <CssBaseline />
            <NextIntlClientProvider>
              <StoreProvider>{children}</StoreProvider>
            </NextIntlClientProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
