"use client";
import palette from "@/styles/theme/palette";
import ReplayIcon from "@mui/icons-material/Replay";
import { Box, ButtonBase, IconButton } from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import PhotoPreview from "./PhotoPreview";

export default function DrawingArea({ photoUrl, viewRef, onEnd }) {
  const t = useTranslations();
  const canvasRef = useRef(null);
  const [signatureWidth, setSignatureWidth] = useState(0);
  const colors = [
    "#181818",
    "#5CAEF8",
    "#7DF939",
    "#D52BE9",
    "#D63228",
    "#E27927",
    "#FBFB3F",
    "#FFFFFF",
  ];
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  useEffect(() => {
    if (!viewRef.current) return;

    const el = viewRef.current;

    const handleResize = () => {
      const width = el.clientWidth;
      setSignatureWidth(width * 1);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [viewRef]);

  if (photoUrl) {
    return <PhotoPreview url={photoUrl} />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        width: "100%",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box
        ref={viewRef}
        sx={{
          width: "100%",
          height: "100%",
          p: 0.5,
          backgroundColor: "white",
          border: `3px solid ${palette.colors.c5}`,
        }}
      >
        <Box
          sx={{
            display: signatureWidth === 0 ? "none" : "block",
            backgroundColor: "white",
            border: `1px solid #000`,
          }}
        >
          <SignatureCanvas
            ref={canvasRef}
            penColor={selectedColor}
            onEnd={onEnd}
            maxWidth={6}
            canvasProps={{
              width: signatureWidth - 8, // padding adjustment
              height: signatureWidth - 8,
              style: {
                display: "block",
              },
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 1,
          px: 3,
          gap: 1,
          backgroundColor: "white",
          border: `3px solid ${palette.colors.c5}`,
          borderRadius: 99,
        }}
      >
        {colors.map(color => (
          <ButtonBase
            key={color}
            onClick={() => {
              setSelectedColor(color);
              if (canvasRef.current) {
                canvasRef.current.penColor = color;
              }
            }}
            sx={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              backgroundColor: color,
              border:
                selectedColor === color
                  ? `3px solid ${palette.colors.c5}`
                  : color === "#FFFFFF"
                    ? `1px solid ${palette.colors.c5}`
                    : "none",
              cursor: "pointer",
            }}
          />
        ))}
      </Box>

      <IconButton
        sx={{
          border: `2px solid ${palette.colors.c5}`,
          backgroundColor: "white",
        }}
        onClick={() => {
          if (canvasRef.current) {
            canvasRef.current.clear();
          }
        }}
      >
        <ReplayIcon />
      </IconButton>
    </Box>
  );
}
