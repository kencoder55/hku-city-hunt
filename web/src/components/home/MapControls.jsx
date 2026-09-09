"use client";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import { IconButton, Paper } from "@mui/material";

export default function MapControls({ onZoomIn, onZoomOut }) {
  return (
    <Paper
      elevation={3}
      sx={{
        position: "absolute",
        top: 24,
        right: 24,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        p: 0.5,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: 2,
        zIndex: 1000,
      }}
    >
      <IconButton
        onClick={onZoomIn}
        sx={{
          backgroundColor: "white",
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
        }}
      >
        <ZoomInIcon />
      </IconButton>
      <IconButton
        onClick={onZoomOut}
        sx={{
          backgroundColor: "white",
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
        }}
      >
        <ZoomOutIcon />
      </IconButton>
    </Paper>
  );
}
