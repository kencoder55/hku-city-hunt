"use client";
import { MissionApi } from "@/data/MissionApi";
import ReactSwal from "@/helper/AlertHelper";
import { missionTypeStyles } from "@/helper/GlobalValueHelper";
import { useRouter } from "@/i18n/navigation";
import { Box, Button, Container, Stack } from "@mui/material";
import html2canvas from "html2canvas-pro";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import FullScreenLoading from "../common/FullScreenLoading";
import HeaderBanner from "../common/HeaderBanner";
import CameraView from "./CameraView";
import MissionPageLayout from "./MissionPageLayout";
import PhotoPreview from "./PhotoPreview";
import BottomColorBar from "../common/BottomColorBar";
import { sendButtonClick } from "@/helper/GAHelper";

export default function MissionPhoto({ mission }) {
  const router = useRouter();
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const filterImageUrl = mission.parameter?.image_url;
  const [finalImage, setFinalImage] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const viewRef = useRef();
  const webcamRef = useRef();
  const [webcamScreenshot, setWebcamScreenshot] = useState(null);

  const nextStep = async () => {
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
      console.error("解析任務參數時發生錯誤：", error);
      ReactSwal.fire({
        icon: "error",
        title: t("error.title"),
        text: t(error.message || "error.unknown_error"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadPhoto = async () => {
    try {
      if (!finalImage) {
        ReactSwal.fire({
          icon: "error",
          title: t("error.title"),
          text: t("error.unable_to_complete_mission"),
        });
        return;
      }

      setIsLoading(true);

      // convert finalImage dataURL to file
      const imageResponse = await fetch(finalImage);
      const blob = await imageResponse.blob();
      const file = new File([blob], "photo.png", { type: "image/png" });

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
      console.error("上傳照片時發生錯誤：", error);
      ReactSwal.fire({
        icon: "error",
        title: t("error.title"),
        text: t(error.message || "error.unknown_error"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetake = () => {
    setWebcamScreenshot(null);
    setFinalImage(null);
    setPhotoUrl(null);
  };

  const capturePhoto = async () => {
    if (!webcamRef.current || !viewRef.current) {
      return;
    }

    try {
      setIsLoading(true);
      const webcamScreenshot = webcamRef.current.getScreenshot();
      setWebcamScreenshot(webcamScreenshot);

      // capture the viewRef as image
      const canvas = await html2canvas(viewRef.current, {
        useCORS: true,
        scale: 2,
      });
      const dataUrl = canvas.toDataURL("image/jpeg");
      setFinalImage(dataUrl);
    } catch (error) {
      console.error("擷取照片時發生錯誤：", error);
      ReactSwal.fire({
        icon: "error",
        title: t("error.title"),
        text: t("error.unable_to_capture_photo"),
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
        backgroundImage: 'url("/assets/images/mission-bg/photo.png")',
        backgroundSize: "cover",
        backgroundPosition: "bottom",
      }}
    >
      <FullScreenLoading open={isLoading} />
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
            mx: -2, // to offset Container padding
            flex: 1,
          }}
        >
          {photoUrl ? (
            <PhotoPreview url={photoUrl} />
          ) : (
            <CameraView
              filterImageUrl={filterImageUrl}
              viewRef={viewRef}
              webcamRef={webcamRef}
              webcamScreenshot={webcamScreenshot}
            />
          )}
        </Box>

        {!photoUrl && !webcamScreenshot && (
          <Button variant="contained" onClick={capturePhoto} disabled={isLoading}>
            {t("mission.take_photo")}
          </Button>
        )}

        {!photoUrl && webcamScreenshot && (
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={handleRetake} disabled={isLoading}>
              {t("mission.retake")}
            </Button>
            <Button
              variant="contained"
              disabled={isLoading || !finalImage}
              onClick={handleUploadPhoto}
            >
              {t("mission.upload_photo")}
            </Button>
          </Stack>
        )}

        {photoUrl && (
          <Button variant="contained" onClick={nextStep} disabled={isLoading}>
            {t("mission.complete")}
          </Button>
        )}

        <BottomColorBar color={missionTypeStyles(mission.type).color} />
      </MissionPageLayout>
    </Box>
  );
}
