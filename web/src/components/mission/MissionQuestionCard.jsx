"use client";
import palette from "@/styles/theme/palette";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "use-intl";

export default function MissionQuestionCard({ question }) {
  const t = useTranslations();
  return (
    <Box
      sx={{
        textAlign: "center",
        backgroundColor: "#C8AF7E",
        p: 2,
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        minWidth: 200,
        maxWidth: "100%",
        overflowWrap: "break-word",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          position: "relative",
        }}
      >
        <Box
          component={"img"}
          src="/assets/icons/conversation.svg"
          sx={{
            position: "absolute",
            left: 0,
            top: -16,
            width: 56,
            height: 56,
          }}
        />

        <Typography variant="h6" color="white">
          {t("mission.question_label")}
        </Typography>

        <Box
          component={"img"}
          src="/assets/icons/question-mark.svg"
          sx={{
            position: "absolute",
            right: 0,
            top: -16,
            width: 56,
            height: 56,
          }}
        />

        <Box
          component={"img"}
          src="/assets/icons/question-mark.svg"
          sx={{
            position: "absolute",
            right: 32,
            top: 0,
            width: 32,
            height: 32,
            rotate: "-30deg",
          }}
        />
      </Box>

      <Box
        sx={{
          backgroundColor: palette.background.default,
          color: palette.text.primary,
          p: 3,
          borderRadius: 4,
          whiteSpace: "pre-line",
        }}
      >
        <Typography variant="h6">{question}</Typography>
      </Box>
    </Box>
  );
}
