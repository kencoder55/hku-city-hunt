"use client";
import { Box, Typography } from "@mui/material";
import palette from "@/styles/theme/palette";
import { useTranslations } from "next-intl";

export default function MissionIntroCard({
  title,
  description,
  address,
  backgroundColor = palette.primary.main,
  descriptionBoxHeight = 100,
}) {
  const t = useTranslations();
  const displayTitle = title ?? t("mission.mission_intro");
  return (
    <Box
      sx={{
        textAlign: "center",
        backgroundColor: backgroundColor,
        p: 2,
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Typography variant="h5" color="white">
        {displayTitle}
      </Typography>

      <Box
        sx={{
          backgroundColor: palette.background.paper,
          color: palette.text.primary,
          p: 2,
          borderRadius: 4,
          minHeight: descriptionBoxHeight,
          maxHeight: descriptionBoxHeight * 1.2,
          overflowY: "auto",
        }}
      >
        <Typography
          sx={{
            whiteSpace: "pre-wrap",
            textAlign: "left",
          }}
        >
          {description}
        </Typography>
      </Box>

      {address && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            px: 1,
          }}
        >
          <Box
            component={"img"}
            src="/assets/icons/location.svg"
            sx={{
              height: 32,
              width: 32,
            }}
          />
          <Box
            sx={{
              flex: 1,
            }}
          >
            <Typography color="white">{address}</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
