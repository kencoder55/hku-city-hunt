"use client";
import { Box, ButtonBase } from "@mui/material";
import PinIcon from "./PinIcon";
import CompletedPinIcon from "./CompletedPinIcon";
import palette from "@/styles/theme/palette";

export default function MapPoint({ point, onClick, size = 40, isCompleted = false }) {
  return (
    <ButtonBase
      onClick={() => onClick(point)}
      sx={{
        position: "absolute",
        left: `${point.x}%`,
        top: `${point.y}%`,
        cursor: "pointer",
        width: size,
        height: size,
        borderRadius: 1,
        // position the element so its bottom-center is exactly at the map point
        transform: "translate(-50%, -100%)",
        transformOrigin: "bottom center",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translate(-50%, -100%) scale(1.2)",
        },
      }}
    >
      <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
        {isCompleted ? (
          <CompletedPinIcon
            width="100%"
            height="100%"
            color={point.color}
            style={{
              display: "block",
            }}
          />
        ) : (
          <PinIcon
            width="100%"
            height="100%"
            color={point.color}
            style={{
              display: "block",
            }}
          />
        )}
      </Box>
    </ButtonBase>
  );
}
