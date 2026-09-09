"use client";
import { Box } from "@mui/material";
import Webcam from "react-webcam";

export default function CameraView({ filterImageUrl, viewRef, webcamRef, webcamScreenshot }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        gap: 2,
        width: "100%",
      }}
    >
      <Box
        ref={viewRef}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          width: "100%",
          height: "auto",
          aspectRatio: 1 / 1,
        }}
      >
        {webcamScreenshot ? (
          <Box
            component={"img"}
            src={webcamScreenshot}
            alt="Captured"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={"99%"}
            height={"99%"}
            style={{
              objectFit: "cover",
            }}
            videoConstraints={{
              width: 1080,
              height: 1080,
              facingMode: "environment",
            }}
          />
        )}
        <Box
          component={"img"}
          src={filterImageUrl}
          alt="Mission related"
          sx={{
            width: "100%",
            height: "100%",
            position: "absolute",
            // center the overlay
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        />
      </Box>
    </Box>
  );
}
