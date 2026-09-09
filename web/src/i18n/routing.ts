import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "zh-HK"],

  // Used when no locale matches
  defaultLocale: "zh-HK",

  localePrefix: "as-needed",

  localeCookie: {
    name: "hku_city_hunt_WEB_LOCALE",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  },

  localeDetection: false,
});
