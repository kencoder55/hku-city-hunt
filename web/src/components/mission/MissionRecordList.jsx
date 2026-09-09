"use client";
import palette from "@/styles/theme/palette";
import { ButtonBase, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import moment from "moment";
import { useTranslations } from "next-intl";

export default function MissionRecordList({ missionRecordList, onRecordClick }) {
  const t = useTranslations();
  return (
    <>
      <Box
        sx={{
          zIndex: 1,
          mt: 4,
          backgroundColor: palette.background.paper,
          width: "100%",
          display: "flex",
          borderRadius: 8,
          p: 2,
          flexDirection: "column",
          gap: 1,
          overflowY: "auto",
          flex: 1,
        }}
      >
        {!missionRecordList.length && (
          <Typography color="textSecondary" align="center" sx={{ mt: 4 }}>
            {t("mission.no_records")}
          </Typography>
        )}

        {missionRecordList.map((record, index) => (
          <ButtonBase
            key={index}
            onClick={() => onRecordClick(record)}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #e0e0e0",
              py: 1,
              pb: 2,
              borderRadius: 2,
            }}
          >
            <Stack spacing={0.5} alignItems={"flex-start"}>
              <Typography color="textSecondary">
                {moment(record.createdAt).format("YYYY-MM-DD HH:mm")}
              </Typography>

              <Typography
                variant="h6"
                textAlign={"left"}
              >{`${t("mission.completed")}<${record.mission.name}>`}</Typography>
            </Stack>

            <Box
              sx={{
                backgroundColor: palette.colors.c9,
                px: 1,
                py: 0.5,
                borderRadius: 99,
                color: "white",
              }}
            >
              {t("mission.view_record_details")}
            </Box>
          </ButtonBase>
        ))}
      </Box>

      <Box
        component={"img"}
        src="/assets/images/mission-record-bg.png"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(6px)",
        }}
      />
    </>
  );
}
