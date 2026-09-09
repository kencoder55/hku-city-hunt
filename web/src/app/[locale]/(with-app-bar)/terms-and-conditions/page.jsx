"use client";

import ContentCard from "@/components/common/ContentCard";
import palette from "@/styles/theme/palette";
import { Box, Container, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function AboutUs({ params }) {
  const t = useTranslations("terms");

  return (
    <Container
      maxWidth={false}
      sx={{
        backgroundColor: palette.colors.c10,
        minHeight: "100%",
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        py: 4,
      }}
    >
      <ContentCard title={t("title")} titleColor="#6D5831">
        <Typography sx={{ lineHeight: 1.8, whiteSpace: "pre-line" }}>{t("content")}</Typography>
      </ContentCard>
    </Container>
  );
}
