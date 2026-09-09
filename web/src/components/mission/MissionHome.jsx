"use client";
import { missionTypeStyles } from "@/helper/GlobalValueHelper";
import { useRouter } from "@/i18n/navigation";
import { useAppSelector } from "@/lib/hooks";
import palette from "@/styles/theme/palette";
import { Box, Button, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import BottomColorBar from "../common/BottomColorBar";
import NavigationButton from "../common/NavigationButton";
import MissionIntroCard from "./MissionIntroCard";
import MissionPageLayout from "./MissionPageLayout";
import MissionStartButton from "./MissionStartButton";
import { useEffect, useState } from "react";

export default function MissionHome({ mission, isActive }) {
  const router = useRouter();
  const t = useTranslations();
  const user = useAppSelector(state => state.user);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  const startMission = () => {
    router.push(`/missions/${mission.slug}/start`);
  };

  const goToLogin = () => {
    const redirectUrl = `/missions/${mission.slug}`;
    router.push("/members/login?redirect=" + encodeURIComponent(redirectUrl));
  };

  return (
    <MissionPageLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          flex: 1,
          width: "100%",
        }}
      >
        <Box
          component={"img"}
          src={
            mission.coverImage ? mission.coverImage : "/assets/images/default-image-placeholder.svg"
          }
          sx={{
            maxWidth: "50%",
            height: "auto",
            // borderRadius: 99,
            // backgroundColor: "white",
            // border: `4px solid ${palette.colors.c6}`,
          }}
        />

        <Box
          sx={{
            py: 2,
            backgroundColor: "#2B982B",
            width: "100%",
            borderRadius: 4,
          }}
        >
          <MissionIntroCard
            title={t("mission.mission_intro")}
            description={mission.description}
            address={mission?.address}
            backgroundColor={palette.primary.main}
          />
        </Box>
      </Box>

      <Stack
        direction="column"
        spacing={1}
        justifyContent="center"
        alignItems="center"
        sx={{ py: 2 }}
      >
        <Box>
          {!isLoggedIn ? (
            <Button variant="contained" onClick={goToLogin}>
              {t("layout.login")}
            </Button>
          ) : isActive ? (
            <MissionStartButton mission={mission} onStart={startMission} />
          ) : (
            <Button
              variant="contained"
              disabled
            >
              {t("mission.not_active")}
            </Button>
          )}
        </Box>

        <NavigationButton
          variant="secondary"
          locations={mission.location}
          buttonText={t("mission.navigate")}
        />
      </Stack>

      <BottomColorBar color={missionTypeStyles(mission.type).color} />
    </MissionPageLayout>
  );
}
