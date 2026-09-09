import { Box, Typography } from "@mui/material";
import palette from "@/styles/theme/palette";

export default function ContentCard({ title, titleColor, borderColor, children }) {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        flex: 1,
        overflowY: "auto",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h5" textAlign="center" color={titleColor || "white"}>
        {title}
      </Typography>

      <Box
        sx={{
          backgroundColor: palette.background.paper,
          borderRadius: 4,
          p: 4,
          textAlign: "left",
          width: "100%",
          overflowY: "auto",
          border: `3px solid ${borderColor || palette.primary.main}`,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
