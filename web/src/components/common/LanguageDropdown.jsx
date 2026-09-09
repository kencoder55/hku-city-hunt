"use client";

import { usePathname } from "@/i18n/navigation";
import LanguageIcon from "@mui/icons-material/Language";
import { Box, IconButton, Link, Menu, MenuItem, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function LanguageDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();

  return (
    <Box
      sx={{
        color: "inherit",
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 2,
        py: 1,
        flexDirection: "row",
        width: "auto",
      }}
    >
      <LanguageIcon />
      <Link
        sx={{
          color: "inherit",
          textDecoration: "none",
          py: 0.5,
        }}
        href={locale === "en" ? pathname : "/en" + pathname}
      >
        <Typography>{t(locale === "en" ? "language.zh-HK" : "language.en")}</Typography>
      </Link>
    </Box>
  );
}
