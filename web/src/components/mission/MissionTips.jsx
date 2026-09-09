"use client";
import palette from "@/styles/theme/palette";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function MissionTips({ message }) {
  const t = useTranslations();

  return (
    <Box
      sx={{
        border: "1px solid #ccc",
        borderRadius: 4,
        py: 4,
        px: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        backgroundColor: "#DBAD58",
        color: "#fff",
      }}
    >
      <Typography variant="h4" textAlign={"center"}>
        {t("mission.mission_tips")}
      </Typography>
      <Box
        sx={{
          p: 2,
          backgroundColor: "white",
          color: palette.text.primary,
          borderRadius: 3,
          whiteSpace: "pre-line",
        }}
      >
        <Typography variant="h6" textAlign={"center"}>
          {message}
        </Typography>
      </Box>
    </Box>
  );
}
