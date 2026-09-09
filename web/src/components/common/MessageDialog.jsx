"use client";
import InfoIcon from "@mui/icons-material/Info";
import { Box, Button, Dialog, Typography } from "@mui/material";

export default function MessageDialog({ open, title, message, confirmText, onSubmit, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 4, p: 2 } } }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          backgroundColor: "#FF9992",
          borderRadius: 2,
          p: 2,
          gap: 2,
        }}
      >
        <InfoIcon sx={{ fontSize: 80, color: "white" }} />

        <Typography variant="h6" textAlign={"center"} color="white">
          {title}
        </Typography>
        {message && (
          <Typography variant="body1" textAlign={"center"} color="white">
            {message}
          </Typography>
        )}

        <Button
          variant="contained"
          onClick={onSubmit}
          sx={{ mb: 2, backgroundColor: "error.main", borderColor: "error.main" }}
        >
          {confirmText || "OK"}
        </Button>
      </Box>
    </Dialog>
  );
}
