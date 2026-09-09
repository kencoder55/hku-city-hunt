import { Box } from "@mui/material";

export default function MissionLayout({ children }) {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        backgroundImage: "url('/assets/images/mission-bg.svg')",
        backgroundSize: "cover",
        backgroundPosition: "bottom",
        overflow: "hidden",
      }}
    >
      {children}
    </Box>
  );
}
