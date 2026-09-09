"use client";
import { MissionApi } from "@/data/MissionApi";
import ReactSwal from "@/helper/AlertHelper";
import { missionTypeStyles } from "@/helper/GlobalValueHelper";
import { getTranslationField } from "@/helper/UnitsHelper";
import { useRouter } from "@/i18n/navigation";
import palette from "@/styles/theme/palette";
import { Box, Button, ButtonBase, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import HeaderBanner from "../common/HeaderBanner";
import MissionPageLayout from "./MissionPageLayout";
import MissionQuestionCard from "./MissionQuestionCard";
import BottomColorBar from "../common/BottomColorBar";
import { sendButtonClick } from "@/helper/GAHelper";

export default function MissionQuiz({ mission }) {
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const nextStep = async () => {
    console.log("Navigate to next step");

    try {
      setIsLoading(true);
      const option = mission.parameter.options.find(opt => opt.value === selectedOption);

      if (!option) {
        ReactSwal.fire({
          icon: "error",
          title: t("error.title"),
          text: t("error.invalid_option_selected"),
        });
        return;
      }

      const response = await MissionApi.finishMission(mission.slug, option);

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
        overflow: "hidden",
        backgroundImage: "url('/assets/images/mission-bg/quiz.png')",
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
            width: "100%",
          }}
        >
          <MissionQuestionCard
            question={mission.parameter[getTranslationField("question", locale)]}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              pt: 4,
              maxWidth: "100%",
              width: "100%",
              overflowWrap: "break-word",
            }}
          >
            {mission.parameter.options.map((option, index) => (
              <ButtonBase
                key={index}
                onClick={() => setSelectedOption(option.value)}
                sx={{
                  width: "100%",
                  backgroundColor:
                    selectedOption === option.value ? palette.primary.main : palette.colors.c10,
                  p: 2,
                  borderRadius: 3,
                  border: "3px solid white",
                  color: selectedOption === option.value ? "white" : palette.text.primary,
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    gap: 3,
                    alignItems: "center",
                  }}
                >
                  <Typography>{String.fromCharCode(65 + index)}.</Typography>
                  <Typography variant="body1">
                    {option[getTranslationField("label", locale)]}
                  </Typography>
                </Box>
              </ButtonBase>
            ))}
          </Box>
        </Box>

        <Button variant="contained" disabled={selectedOption === null || isLoading} onClick={nextStep}>
          {t("mission.complete")}
        </Button>

        <BottomColorBar color={missionTypeStyles(mission.type).color} />
      </MissionPageLayout>
    </Box>
  );
}
