"use client";
import { MissionApi } from "@/data/MissionApi";
import ReactSwal from "@/helper/AlertHelper";
import { useRouter } from "@/i18n/navigation";
import { Box, Button, Container, Typography } from "@mui/material";
import html2canvas from "html2canvas-pro";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import DrawingArea from "./DrawingArea";
import HeaderBanner from "../common/HeaderBanner";
import { missionTypeStyles } from "@/helper/GlobalValueHelper";
import MissionPageLayout from "./MissionPageLayout";
import palette from "@/styles/theme/palette";
import BottomColorBar from "../common/BottomColorBar";
import { sendButtonClick } from "@/helper/GAHelper";

export default function MissionPainting({ mission }) {
  const router = useRouter();
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const viewRef = useRef(null);
  const canvasRef = useRef(null);
  const [signatureWidth, setSignatureWidth] = useState(0);
  const penColor = "black";
  const [finalImage, setFinalImage] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    if (!viewRef.current) return;

    const handleResize = () => {
      if (viewRef.current) {
        const width = viewRef.current.clientWidth;
        setSignatureWidth(width * 0.8); // Set signature width to 80% of the container's width
      }
    };

    // Initial width set
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [viewRef]);

  const handleFinishDrawing = () => {
    setIsFinished(true);
  };

  const captureScreenshot = async () => {
    if (!viewRef.current) return;

    try {
      setIsLoading(true);
      const canvas = await html2canvas(viewRef.current, {
        useCORS: true,
        scale: 2,
      });
      const dataUrl = canvas.toDataURL("image/png");
      // automatically upload captured screenshot
      await handleUploadPhoto(dataUrl);
    } catch (error) {
      console.error("Error capturing screenshot:", error);
      ReactSwal.fire({
        icon: "error",
        title: t("error.title"),
        text: t("error.unable_to_capture_photo"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // allow optional dataUrl param so caller can upload immediately after capture
  const handleUploadPhoto = async dataUrl => {
    try {
      if (!dataUrl) {
        ReactSwal.fire({
          icon: "error",
          title: t("error.title"),
          text: t("error.unable_to_complete_mission"),
        });
        return;
      }

      setIsLoading(true);

      // convert dataURL to file
      const imageResponse = await fetch(dataUrl);
      const blob = await imageResponse.blob();
      const file = new File([blob], "signature.png", { type: "image/png" });

      const url = await MissionApi.uploadPhoto(file);

      if (!url) {
        ReactSwal.fire({
          icon: "error",
          title: t("error.title"),
          text: t("error.unable_to_complete_mission"),
        });
        return;
      }

      setPhotoUrl(url);
    } catch (error) {
      console.error("Error uploading photo:", error);
      ReactSwal.fire({
        icon: "error",
        title: t("error.title"),
        text:
          error?.message && t.has(error.message)
            ? t(error.message)
            : t("error.unable_to_complete_mission"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = async () => {
    console.log("Navigate to next step");

    try {
      setIsLoading(true);
      const response = await MissionApi.finishMission(mission.slug, {
        url: photoUrl,
        message_zh: mission.parameter?.message_zh,
        message_en: mission.parameter?.message_en,
      });

      if (!response) {
        ReactSwal.fire({
          icon: "error",
          title: t("error.title"),
          text: t("error.unable_to_complete_mission"),
        });
        return;
      }

      sendButtonClick("mission_complete", { mission_slug: mission.slug });
      router.push(`/mission-records/${response.slug}`);
    } catch (error) {
      console.error("Error parsing mission parameter:", error);
      ReactSwal.fire({
        icon: "error",
        title: t("error.title"),
        text:
          error?.message && t.has(error.message)
            ? t(error.message)
            : t("error.unable_to_complete_mission"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundImage: 'url("/assets/images/mission-bg/painting.png")',
        backgroundSize: "cover",
        backgroundPosition: "bottom",
      }}
    >
      <HeaderBanner
        title={mission.name}
        leftIcon={missionTypeStyles(mission.type).leftIcon}
        rightIcon={missionTypeStyles(mission.type).rightIcon}
        backgroundColor={missionTypeStyles(mission.type).color}
        fullWidth
      />

      <MissionPageLayout>
        <Box
          sx={{
            p: 2,
            backgroundColor: palette.background.paper,
            borderRadius: 4,
            width: "100%",
            textAlign: "center",
            outline: `2px solid ${palette.primary.main}`,
            outlineOffset: "-6px",
          }}
        >
          <Typography variant="h6">{mission.description}</Typography>
        </Box>

        <Box
          sx={{
            width: "100%",
            flex: 1,
          }}
        >
          <DrawingArea viewRef={viewRef} photoUrl={photoUrl} onEnd={handleFinishDrawing} />
        </Box>

        {!photoUrl ? (
          <Button variant="contained" onClick={captureScreenshot} disabled={isLoading}>
            {t("mission.drawing_complete")}
          </Button>
        ) : (
          <Button variant="contained" onClick={nextStep} disabled={isLoading}>
            {t("mission.complete")}
          </Button>
        )}

        <BottomColorBar color={missionTypeStyles(mission.type).color} />
      </MissionPageLayout>
    </Box>
  );
}
