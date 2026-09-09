"use client";
import { MissionApi } from "@/data/MissionApi";
import ReactSwal from "@/helper/AlertHelper";
import { missionTypeStyles } from "@/helper/GlobalValueHelper";
import { useRouter } from "@/i18n/navigation";
import { Box, Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import HeaderBanner from "../common/HeaderBanner";
import MissionPageLayout from "./MissionPageLayout";
import WalkTracker from "./WalkTracker";
import BottomColorBar from "../common/BottomColorBar";
import { sendButtonClick } from "@/helper/GAHelper";

export default function MissionWalking({ mission }) {
  const router = useRouter();
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [totalDistance, setTotalDistance] = useState(0);

  useEffect(() => {
    return () => {};
  }, []);

  const handleFinish = distance => {
    setIsCompleted(true);
    setTotalDistance(distance);
  };

  const nextStep = async () => {
    try {
      setIsLoading(true);
      const response = await MissionApi.finishMission(mission.slug, {
        message_zh: mission.parameter?.message_zh,
        message_en: mission.parameter?.message_en,
        total_distance: totalDistance,
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
      console.error("Error completing mission:", error);
      ReactSwal.fire({
        icon: "error",
        title: t("error.title"),
        text: t(error.message || "error.unknown_error"),
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
        backgroundImage: 'url("/assets/images/mission-bg/walking.png")',
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
        <WalkTracker mission={mission} isLoading={isLoading} onFinish={handleFinish} />

        <Button variant="contained" onClick={nextStep} disabled={!isCompleted || isLoading}>
          {t("mission.complete")}
        </Button>

        <BottomColorBar color={missionTypeStyles(mission.type).color} />
      </MissionPageLayout>
    </Box>
  );
}
