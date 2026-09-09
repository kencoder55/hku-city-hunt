import AuthContainer from "@/components/common/AuthContainer";
import HeaderBanner from "@/components/common/HeaderBanner";
import MissionHome from "@/components/mission/MissionHome";
import { MissionApi } from "@/data/MissionApi";
import { missionTypeStyles } from "@/helper/GlobalValueHelper";
import { Box } from "@mui/material";
import { notFound, error as nextError } from "next/navigation";

export default async function Mission({ params }) {
  const { slug, locale } = await params;

  let mission;
  try {
    mission = await MissionApi.getMissionBySlug(slug, locale);
  } catch (err) {
    console.error("[Mission/slug] Failed to fetch mission:", err?.message);
    throw new Error("Internal Server Error");
  }

  console.log("mission:", mission);

  if (!mission) {
    notFound();
  }

  // check if the mission is active based on startTime and endTime
  const now = new Date();
  const startTime = new Date(mission.startTime);
  const endTime = new Date(mission.endTime);
  let isActive = true;

  if (now < startTime || now > endTime) {
    isActive = false;
  }

  return (
    <Box>
      <HeaderBanner
        title={mission.name}
        leftIcon={missionTypeStyles(mission.type).leftIcon}
        rightIcon={missionTypeStyles(mission.type).rightIcon}
        backgroundColor={missionTypeStyles(mission.type).color}
        fullWidth
      />
      <MissionHome mission={mission} isActive={isActive} />
    </Box>
  );
}
