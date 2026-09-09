"use client";
import { MissionApi } from "@/data/MissionApi";
import ReactSwal from "@/helper/AlertHelper";
import { missionTypeStyles } from "@/helper/GlobalValueHelper";
import { getTranslationField } from "@/helper/UnitsHelper";
import { useRouter } from "@/i18n/navigation";
import { Box, Button } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import HeaderBanner from "../common/HeaderBanner";
import MissionPageLayout from "./MissionPageLayout";
import MissionQuestionCard from "./MissionQuestionCard";
import BottomColorBar from "../common/BottomColorBar";
import { sendButtonClick } from "@/helper/GAHelper";

export default function MissionReflection({ mission }) {
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(false);

  console.log("MissionReflection rendered, mission:", mission);

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
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 2,
            alignItems: "center",
            flex: 1,
          }}
        >
          <MissionQuestionCard
            question={mission.parameter[getTranslationField("message", locale)]}
          />
        </Box>

        <Button variant="contained" onClick={nextStep} disabled={isLoading}>
          {t("mission.complete")}
        </Button>

        <BottomColorBar color={missionTypeStyles(mission.type).color} />
      </MissionPageLayout>
    </Box>
  );
}
