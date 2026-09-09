import AuthContainer from "@/components/common/AuthContainer";
import HeaderBanner from "@/components/common/HeaderBanner";
import MissionRecordDetail from "@/components/mission/MissionRecordDetail";
import { MissionRecordApi } from "@/data/MissionRecordApi";
import { missionTypeStyles } from "@/helper/GlobalValueHelper";
import { Box } from "@mui/material";
import { notFound } from "next/navigation";

export default async function MissionRecords({ params }) {
  const { slug, locale } = await params;

  let missionRecord;
  try {
    missionRecord = await MissionRecordApi.getMissionRecordBySlug(slug, locale);
  } catch (error) {
    console.error('[MissionRecords] Failed to fetch mission record:', error?.message);
    throw new Error('Internal Server Error');
  }

  if (!missionRecord) {
    notFound();
  }

  return (
    <AuthContainer>
      <Box
        sx={{
          display: "flex",
          position: "relative",
          flexDirection: "column",
          backgroundImage: "url('/assets/images/mission-ecord-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "bottom",
          backgroundRepeat: "no-repeat",
          overflow: "hidden",
        }}
      >
        <HeaderBanner
          title={missionRecord.mission.name}
          leftIcon={missionTypeStyles(missionRecord.mission.type).leftIcon}
          rightIcon={missionTypeStyles(missionRecord.mission.type).rightIcon}
          backgroundColor={missionTypeStyles(missionRecord.mission.type).color}
          fullWidth
        />

        <MissionRecordDetail missionRecord={missionRecord} />
      </Box>
    </AuthContainer>
  );
}
