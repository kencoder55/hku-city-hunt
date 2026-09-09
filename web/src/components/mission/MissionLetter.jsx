"use client";
import { MissionApi } from "@/data/MissionApi";
import ReactSwal from "@/helper/AlertHelper";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useState, useEffect } from "react";
import MissionPageLayout from "./MissionPageLayout";
import HeaderBanner from "../common/HeaderBanner";
import palette from "@/styles/theme/palette";
import { missionTypeStyles } from "@/helper/GlobalValueHelper";
import { useAppSelector } from "@/lib/hooks";
import BottomColorBar from "../common/BottomColorBar";
import { sendButtonClick } from "@/helper/GAHelper";

export default function MissionLetter({ mission }) {
  const router = useRouter();
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const user = useAppSelector(state => state.user);

  const finishMission = async () => {
    try {
      setIsLoading(true);

      const result = {
        text: text,
        message_zh: "我們已送出你的信件\n\n1 年後的今天\n你會在你的郵箱\n收到你給自己的信息。",
        message_en:
          "We have sent your letter.\n\nOne year later, on this day,\nyou will receive a message in your mailbox\nthat you wrote to yourself.",
      };

      const response = await MissionApi.finishMission(mission.slug, result);

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
        backgroundImage: 'url("/assets/images/mission-bg/letter.png")',
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
          <Typography variant="h5" color={palette.colors.c6}>
            {t("mission.letter.to_future_self")}
          </Typography>
          <Typography variant="h4" color={palette.colors.c6}>
            {user.name}
          </Typography>

          <TextField
            sx={{
              width: "100%",
              pt: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                backgroundColor: "transparent",
              },
            }}
            multiline
            rows={8}
            value={text}
            onChange={e => setText(e.target.value.slice(0, 1000))}
            slotProps={{ htmlInput: { maxLength: 1000 } }}
            helperText={`${text.length} / 1000`}
          />
        </Box>

        <Button variant="contained" disabled={isLoading} onClick={finishMission}>
          {t("mission.complete")}
        </Button>

        <BottomColorBar color={missionTypeStyles(mission.type).color} />
      </MissionPageLayout>
    </Box>
  );
}
