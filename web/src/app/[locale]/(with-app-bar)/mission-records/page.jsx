"use client";
import AuthContainer from "@/components/common/AuthContainer";
import HeaderBanner from "@/components/common/HeaderBanner";
import MissionRecordList from "@/components/mission/MissionRecordList";
import { MissionRecordApi } from "@/data/MissionRecordApi";
import { useRouter } from "@/i18n/navigation";
import { useAppSelector } from "@/lib/hooks";
import { Box, Button, Container, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function MissionRecords() {
  const router = useRouter();
  const [missionRecordList, setMissionRecordList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const t = useTranslations();
  const locale = useLocale();
  const user = useAppSelector(state => state.user);

  useEffect(() => {
    if (!user || !user.id) {
      return;
    }

    fetchMissionRecordList();
  }, [page, pageSize, locale, user]);

  const fetchMissionRecordList = async () => {
    try {
      setIsLoading(true);
      const response = await MissionRecordApi.listMy(page, pageSize, locale);
      const data = response.data || [];
      setMissionRecordList(data);
      setTotal(response.total || 0);
      setPageCount(response.pageCount || 0);

      console.log("Fetched mission record list:", data);
    } catch (error) {
      console.error("Error fetching mission record list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const viewDetail = record => {
    router.push(`/mission-records/${record.slug}`);
  };

  return (
    <AuthContainer>
      <Container
        maxWidth={false}
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          position: "relative",
          flexDirection: "column",
        }}
      >
        <HeaderBanner
          title={t("menu.mission_records")}
          leftIcon="/assets/icons/success-1.svg"
          rightIcon="/assets/icons/stamp.svg"
          backgroundColor="#A8D3C0"
          fullWidth={false}
        />

        <MissionRecordList missionRecordList={missionRecordList} onRecordClick={viewDetail} />

        {/* pagination */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 2,
            zIndex: 2,
          }}
        >
          <Button variant="contained" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            {t("pagination.previous")}
          </Button>
          <Typography color="white" sx={{ mx: 2 }}>
            {`${page} / ${pageCount} ${t("pagination.page")}`}
          </Typography>
          <Button
            variant="contained"
            disabled={page >= pageCount}
            onClick={() => setPage(page + 1)}
          >
            {t("pagination.next")}
          </Button>
        </Box>
      </Container>
    </AuthContainer>
  );
}
