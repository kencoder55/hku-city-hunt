import { Box } from "@mui/material";

export default function ProfileLayout({ children }) {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        backgroundImage: "url('/assets/images/member-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "bottom",
        overflowY: "auto",
      }}
    >
      {children}
    </Box>
  );
}
