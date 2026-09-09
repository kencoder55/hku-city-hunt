"use client";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function PhotoPreview({ url }) {
  const t = useTranslations("mission");

  return (
    <Box>
      <Box
        component={"img"}
        src={url}
        sx={{
          width: "100%",
          height: "auto",
          aspectRatio: 1 / 1,
        }}
      />

      <Typography textAlign="center" variant="h6" py={1}>
        {t("save_photo_instruction")}
      </Typography>
    </Box>
  );
}
