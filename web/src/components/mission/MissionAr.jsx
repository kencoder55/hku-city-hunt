"use client";
import { MissionApi } from "@/data/MissionApi";
import ReactSwal from "@/helper/AlertHelper";
import { Box, Button, Stack, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useRef, useState } from "react";
import HeaderBanner from "../common/HeaderBanner";
import { missionTypeStyles } from "@/helper/GlobalValueHelper";
import MissionPageLayout from "./MissionPageLayout";
import html2canvas from "html2canvas-pro";
import FullScreenLoading from "../common/FullScreenLoading";
import PhotoPreview from "./PhotoPreview";
import { sendButtonClick } from "@/helper/GAHelper";

export default function MissionAr({ mission }) {
  const router = useRouter();
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

  const nextStep = async () => {
    console.log("Navigate to next step");

    try {
      setIsLoading(true);
      const response = await MissionApi.finishMission(mission.slug, {
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
        text: t(error.message || "error.unknown_error"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get the actual container width from theme breakpoints
  const getContainerWidth = () => {
    // Get the breakpoint value from theme
    const breakpointValue = theme.breakpoints.values.sm;
    return breakpointValue ? `${breakpointValue}px` : "100%";
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundImage: 'url("/assets/images/mission-bg/reflection.png")',
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
            width: getContainerWidth(),
            height: "100%",
            position: "relative",
          }}
        >
          <Box
            component={"iframe"}
            src="https://ar.blippar.com/fl3tdqw47xew3xr0prfjstdkdyhld5fynbx9n2p6"
            allow="camera; microphone; xr-spatial-tracking; accelerometer; gyroscope; magnetometer"
            sx={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        </Box>

        <Button variant="contained" onClick={nextStep} disabled={isLoading}>
          {t("mission.complete")}
        </Button>
      </MissionPageLayout>
    </Box>
  );
}
