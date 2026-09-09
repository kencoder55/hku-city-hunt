"use client";

import ContentCard from "@/components/common/ContentCard";
import palette from "@/styles/theme/palette";
import { Box, Container, Link, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function AboutUs({ params }) {
  const t = useTranslations("about");

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
        <Typography sx={{ lineHeight: 1.8, whiteSpace: "pre-line" }}>{t("intro")}</Typography>

        <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: "bold", color: "#6D5831" }}>
          {t("subTitle1")}
        </Typography>
        <Typography sx={{ lineHeight: 1.8, whiteSpace: "pre-line" }}>{t("content1")}</Typography>

        <Box sx={{ mt: 3 }}>
          <Typography sx={{ fontWeight: "bold", mb: 0.5 }}>{t("followTitle")}</Typography>
          <Stack direction="row" spacing={1}>
            <Typography>Facebook: </Typography>
            <Link
              href="https://www.facebook.com/newlife330hk/"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{
                display: "block",
                color: "inherit",
                textDecoration: "underline",
                mb: 0.5,
              }}
            >
              newlife330hk
            </Link>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography>Instagram: </Typography>
            <Link
              href="https://www.instagram.com/newlife330hk/"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ display: "block", color: "inherit", textDecoration: "underline" }}
            >
              newlife330hk
            </Link>
          </Stack>
        </Box>
      </ContentCard>
    </Container>
  );
}
