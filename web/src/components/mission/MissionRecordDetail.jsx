"use client";
import MissionPageLayout from "@/components/mission/MissionPageLayout";
import MissionTips from "@/components/mission/MissionTips";
import { getTranslationField } from "@/helper/UnitsHelper";
import { Link } from "@/i18n/navigation";
import { Box, Button, Stack, Typography } from "@mui/material";
import moment from "moment";
import { useLocale, useTranslations } from "next-intl";

export default function MissionRecordDetail({ missionRecord }) {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <MissionPageLayout
      sx={{
        justifyContent: "flex-start",
        gap: 1,
      }}
    >
      <Typography variant="h2" textAlign={"center"}>
        {t("mission.record_detail.title")}
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        {missionRecord.mission.type == "photo" || missionRecord.mission.type == "painting" ? (
          <Box
            component={"a"}
            href={missionRecord.result?.url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              component={"img"}
              src={missionRecord.result?.url}
              sx={{
                width: "40%",
                mb: 2,
              }}
            />
          </Box>
        ) : (
          <Box
            component={"img"}
            src="/assets/images/result-dayday.png"
            sx={{
              width: "40%",
              mb: 2,
            }}
          />
        )}
      </Box>

      <MissionTips message={missionRecord.result[getTranslationField("message", locale)]} />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 2,
          gap: 1,
        }}
      >
        <Typography variant="body2">
          {moment(missionRecord.createdAt).format("YYYY-MM-DD HH:mm")}
        </Typography>

        {missionRecord.rewarded ? (
          <Typography variant="h6" mb={1} textAlign={"center"}>
            {t("mission.record_detail.earned_stamp")}
          </Typography>
        ) : (
          <Typography variant="h6" mb={1} textAlign={"center"}>
            {t("mission.record_detail.already_earned")}
          </Typography>
        )}

        <Typography variant="h5" color="white" textAlign={"center"} mb={4}>
          {t("mission.record_detail.thank_you")}
        </Typography>

        <Stack direction="column" spacing={1}>
          <Button component={Link} variant="contained" color="primary" href={`/rewards`}>
            {t("mission.record_detail.view_progress")}
          </Button>

          <Button component={Link} variant="contained" color="primary" href={`/`}>
            {t("mission.record_detail.back_to_home")}
          </Button>
        </Stack>
      </Box>
    </MissionPageLayout>
  );
}
