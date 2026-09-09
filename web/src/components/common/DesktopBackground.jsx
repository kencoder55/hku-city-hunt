"use client";
import { Box } from "@mui/material";

export default function DesktopBackground() {
  return (
    <Box
      component={"img"}
      src="/assets/images/main-bg.png"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "110%",
        height: "110%",
        zIndex: -1,
        objectFit: "cover",
        objectPosition: "center",
        pointerEvents: "none",
        userSelect: "none",
        filter: "brightness(0.5) blur(4px)",
        m: -1,
      }}
    />
  );
}
