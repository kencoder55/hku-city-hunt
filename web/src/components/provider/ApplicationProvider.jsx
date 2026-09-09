import { routing } from "@/i18n/routing";
import "@/styles/globals.css";
import { CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import ToastStyledContainer from "../common/ToastStyledContainer";
import ClientThemeProvider from "./ClientThemeProvider";
import StoreProvider from "./StoreProvider";
import ClarityProvider from "./ClarityProvider";
import OrientationGuard from "../common/OrientationGuard";
import DesktopBackground from "../common/DesktopBackground";
import { GoogleAnalytics } from "@next/third-parties/google";

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
      {/* disable ga when developing */}
      {process.env.NODE_ENV !== "development" && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
      )}

      <body>
        <AppRouterCacheProvider options={{ key: "css" }}>
          <ClientThemeProvider locale={locale}>
            <ToastStyledContainer />
            <CssBaseline />
            <ClarityProvider />
            <NextIntlClientProvider>
              <OrientationGuard />
              <StoreProvider>{children}</StoreProvider>
            </NextIntlClientProvider>
            <DesktopBackground />
          </ClientThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
