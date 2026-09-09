"use client";
import { Box } from "@mui/material";

export default function ComingSoon() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundImage: `url(/assets/images/coming-soon-bg-mobile.png)`,
        backgroundSize: "cover",
        backgroundPosition: "top",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}
