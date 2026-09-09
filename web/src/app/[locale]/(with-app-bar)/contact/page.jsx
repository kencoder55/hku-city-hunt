"use client";

import ContentCard from "@/components/common/ContentCard";
import palette from "@/styles/theme/palette";
import { Box, Container, Link, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function Contact({ params }) {
  const t = useTranslations("contact");

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
        <Stack spacing={3} sx={{ px: 2, py: 1 }}>
          <Typography variant="body1">{t("description")}</Typography>

          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Typography variant="body1" fontWeight={600}>
              {t("email_label")}:
            </Typography>
            <Link href={`mailto:${t("email")}`} underline="always" color="inherit">
              <Typography variant="body1">{t("email")}</Typography>
            </Link>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Typography variant="body1" fontWeight={600}>
              {t("whatsapp_label")}:
            </Typography>
            <Link
              href="https://wa.me/85298508185"
              target="_blank"
              rel="noopener noreferrer"
              underline="always"
              color="inherit"
            >
              <Typography variant="body1">{t("whatsapp")}</Typography>
            </Link>
          </Stack>
        </Stack>
      </ContentCard>
    </Container>
  );
}
