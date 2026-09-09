import AuthContainer from "@/components/common/AuthContainer";
import HeaderBanner from "@/components/common/HeaderBanner";
import MissionTamjaiSamgor from "@/components/mission/MissionTamjaiSamgor";
import { MissionApi } from "@/data/MissionApi";
import { missionTypeStyles } from "@/helper/GlobalValueHelper";
import { notFound } from "next/navigation";

export default async function Mission({ params }) {
  const { slug, locale } = await params;

  let mission;
  try {
    mission = await MissionApi.getMissionBySlug("tamjai", locale);
  } catch (error) {
    console.error('[Mission/tamjai] Failed to fetch mission:', error?.message);
    throw new Error('Internal Server Error');
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
    <AuthContainer>
      <HeaderBanner
        title={mission.name}
        leftIcon={missionTypeStyles(mission.type).leftIcon}
        rightIcon={missionTypeStyles(mission.type).rightIcon}
        backgroundColor={missionTypeStyles(mission.type).color}
        fullWidth
      />
      <MissionTamjaiSamgor type="tamjai" mission={mission} isActive={isActive} />
    </AuthContainer>
  );
}
