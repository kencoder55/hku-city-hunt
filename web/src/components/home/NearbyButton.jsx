"use client";
import { Box, ButtonBase, CircularProgress, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function NearbyButton({ onClick, loading = false, isFinded = false, sx = {} }) {
  const t = useTranslations();

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: "5%",
        right: 0,
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        ...sx,
      }}
    >
      <Box
        sx={{
          position: "relative",
        }}
      >
        <Box
          component={"img"}
          src="/assets/icons/finder.png"
          sx={{
            position: "absolute",
            bottom: -24,
            left: 16,
            width: 60,
            mb: 1,
            zIndex: 2,
          }}
        />
        <ButtonBase
          sx={{
            backgroundColor: "primary.main",
            py: 2,
            pr: 6,
            pl: 9,
            borderRadius: 99,
            color: "white",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.4)",
            "&:disable": {
              backgroundColor: "grey.400",
            },
          }}
          onClick={onClick}
          disabled={loading}
        >
          {loading && (
            <CircularProgress size={20} thickness={5} sx={{ color: "white", mr: 1 }} />
          )}
          <Typography variant="h6">
            {isFinded ? t("home.show_all_missions") : t("home.find_nearby")}
          </Typography>
        </ButtonBase>
      </Box>
    </Box>
  );
}
