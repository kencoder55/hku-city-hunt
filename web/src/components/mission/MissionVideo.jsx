"use client";
import { MissionApi } from "@/data/MissionApi";
import ReactSwal from "@/helper/AlertHelper";
import { sendButtonClick } from "@/helper/GAHelper";
import { missionTypeStyles } from "@/helper/GlobalValueHelper";
import { useRouter } from "@/i18n/navigation";
import palette from "@/styles/theme/palette";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import BottomColorBar from "../common/BottomColorBar";
import HeaderBanner from "../common/HeaderBanner";
import MissionPageLayout from "./MissionPageLayout";
export default function MissionVideo({ mission }) {
  const router = useRouter();
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);
  const playerRef = useRef(null);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);

    console.log(mission);
  };

  const handleFinish = () => {
    setRemainingTime(null);
    setIsFinished(true);
    setIsPlaying(false);
  };

  const nextStep = async () => {
    console.log("Navigate to next step");

    try {
      setIsLoading(true);
      if (!isFinished) {
        console.log("Audio not finished yet.");
        return;
      }

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
        backgroundImage: 'url("/assets/images/mission-bg/video.png")',
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
            // justifyContent: "center",
            gap: 2,
            alignItems: "center",
            flex: 1,
            flexDirection: "column",
            width: "100%",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
            }}
          >
            <ReactPlayer
              ref={playerRef}
              src={mission.parameter.video_url}
              playing={isPlaying}
              controls={false}
              playsInline
              onEnded={handleFinish}
              style={{
                pointerEvents: "none",
                width: "100%",
                height: "auto",
              }}
              onTimeUpdate={() => {
                const duration = playerRef?.current?.duration;
                const currentTime = playerRef?.current?.currentTime;
                if (duration && currentTime) {
                  const remaining = Math.max(0, Math.floor(duration - currentTime));
                  setRemainingTime(remaining);
                }
              }}
            />

            <IconButton
              onClick={togglePlay}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                borderRadius: "50%",
              }}
            >
              {isPlaying ? (
                <PauseCircleOutlineIcon sx={{ fontSize: 64, color: "#000" }} />
              ) : (
                <PlayCircleOutlineIcon sx={{ fontSize: 64, color: "#000" }} />
              )}
            </IconButton>
          </Box>

          <Box
            sx={{
              px: 4,
              py: 3,
              backgroundColor: palette.background.paper,
              borderRadius: 2,
              height: 200,
              overflowY: "auto",
            }}
          >
            <Typography color={palette.text.secondary} whiteSpace="pre-line">
              {t("mission.video.about_description")}
            </Typography>
          </Box>

          <Box>
            <Typography>
              {remainingTime !== null && !isFinished
                ? t("mission.video.remaining_time") +
                  remainingTime +
                  t("mission.video.remaining_time_unit")
                : isFinished
                  ? t("mission.video.completed")
                  : t("mission.video.click_to_play")}
            </Typography>
          </Box>
        </Box>

        <Button variant="contained" size="large" disabled={!isFinished || isLoading} onClick={nextStep}>
          {t("mission.complete")}
        </Button>

        <BottomColorBar color={missionTypeStyles(mission.type).color} />
      </MissionPageLayout>
    </Box>
  );
}
