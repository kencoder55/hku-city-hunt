"use client";

import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import ScreenRotationIcon from "@mui/icons-material/ScreenRotation";
import { useTranslations } from "next-intl";

export default function OrientationGuard() {
  const t = useTranslations();
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      // check if device is mobile and in landscape mode
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      // use aspect ratio detection (e.g. 16:9) instead of a fixed pixel buffer
      const aspect = window.innerWidth / window.innerHeight;
      // trigger only for typical landscape ratios (16:9). allow a small tolerance.
      const targetRatio = 16 / 9; // ~1.777
      const tolerance = 0.03; // 3% tolerance
      const isLandscapeMode = aspect >= targetRatio * (1 - tolerance);

      setIsLandscape(isMobile && isLandscapeMode);
    };

    // Initial check
    checkOrientation();

    // Listen for orientation changes
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  if (!isLandscape) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        gap: 3,
      }}
    >
      <ScreenRotationIcon
        sx={{
          fontSize: 80,
          color: "white",
          animation: "rotate 2s ease-in-out infinite",
          "@keyframes rotate": {
            "0%, 100%": {
              transform: "rotate(0deg)",
            },
            "50%": {
              transform: "rotate(90deg)",
            },
          },
        }}
      />
      <Typography
        variant="h5"
        sx={{
          color: "white",
          textAlign: "center",
          px: 4,
          fontWeight: 500,
        }}
      >
        {t("orientation.rotate_device")}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "rgba(255, 255, 255, 0.7)",
          textAlign: "center",
          px: 4,
        }}
      >
        {t("orientation.landscape_not_supported")}
      </Typography>
    </Box>
  );
}
