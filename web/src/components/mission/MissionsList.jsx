"use client";
import { MissionRecordApi } from "@/data/MissionRecordApi";
import ReactSwal from "@/helper/AlertHelper";
import { handleGeolocationError, obtainLocation } from "@/helper/GeolocationHelper";
import { getMissionColor } from "@/helper/GlobalValueHelper";
import { calculateDistance } from "@/helper/UnitsHelper";
import { Link, useRouter } from "@/i18n/navigation";
import palette from "@/styles/theme/palette";
import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  ButtonBase,
  Container,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Box } from "@mui/system";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import OptionalAuthContainer from "@/components/common/OptionalAuthContainer";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function MissionsList({ initialMissions }) {
  const router = useRouter();
  const [missionList] = useState(initialMissions);
  const t = useTranslations();
  const locale = useLocale();
  const [searchStr, setSearchStr] = useState("");
  const [filteredMissionList, setFilteredMissionList] = useState(initialMissions);
  const [isFinded, setIsFinded] = useState(false);
  const [completedMissionIds, setCompletedMissionIds] = useState(new Set());
  const user = useAppSelector(state => state.user);
  const [isLocating, setIsLocating] = useState(false);

  const categoryList = [
    {
      value: "all",
      label: t("mission.category.all"),
    },
    {
      value: "mtr",
      label: t("mission.category.mtr"),
    },
    {
      value: "tamjai",
      label: t("mission.category.tamjai"),
    },
    {
      value: "samgor",
      label: t("mission.category.samgor"),
    },
    {
      value: "eslite",
      label: t("mission.category.eslite"),
    },
    {
      value: "thealchemistcafe",
      label: t("mission.category.thealchemistcafe"),
    },
    {
      value: "cafe330",
      label: t("mission.category.cafe330"),
    },
  ];
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    if (user && user.id) {
      fetchUserMissionRecords();
    } else {
      setCompletedMissionIds(new Set());
    }
  }, [user]);

  useEffect(() => {
    if (!selectedCategory && !searchStr) {
      setFilteredMissionList(missionList);
      return;
    }

    let filteredList = missionList;

    if (selectedCategory === "all") {
      filteredList = missionList;
    } else if (selectedCategory) {
      setIsFinded(false);
      filteredList = filteredList.filter(mission => mission.category === selectedCategory);
    }

    if (searchStr) {
      const lowerSearchStr = searchStr.toLowerCase();
      filteredList = filteredList.filter(mission =>
        mission.name.toLowerCase().includes(lowerSearchStr),
      );
    }

    setFilteredMissionList(filteredList);
  }, [selectedCategory, searchStr, missionList]);

  const fetchUserMissionRecords = async () => {
    try {
      if (!user || !user.id) {
        return;
      }

      const response = await MissionRecordApi.listMy(1, null, locale);
      const records = response.data || [];

      const completedIds = new Set(records.map(record => record.missionId));
      setCompletedMissionIds(completedIds);
    } catch (error) {
      console.error("Error fetching mission records:", error);
    }
  };

  const handleCategorySelect = category => {
    setSelectedCategory(category);
  };

  const handleLocate = async () => {
    try {
      setSelectedCategory("all");

      if (isFinded) {
        setIsFinded(false);
        setFilteredMissionList(missionList);
        return;
      }

      const mapPoints = missionList.flatMap((mission, missionIndex) =>
        mission.location.map((loc, locIndex) => ({
          ...loc,
          name: mission.name,
          coverImage: mission.coverImage,
          description: mission.description,
          wellnessMessage: mission.wellnessMessage,
          slug: mission.slug,
          uniqueKey: `${mission.id}-${loc.code}-${missionIndex}-${locIndex}`,
        })),
      );

      setIsLocating(true);
      const { position } = await obtainLocation({
        enableHighAccuracy: true,
        timeout: 50000,
        maximumAge: 0,
      });
      setIsLocating(false);

      if (!position) {
        await ReactSwal.fire({
          icon: "error",
          title: t("error.gps.unknown_error"),
        });
        return;
      }

      if (!mapPoints || mapPoints.length === 0) {
        await ReactSwal.fire({
          icon: "info",
          title: t("map.no_points"),
        });
        return;
      }

      const validPoints = mapPoints.filter(
        p => typeof p.lat === "number" && typeof p.lng === "number",
      );
      if (validPoints.length === 0) {
        await ReactSwal.fire({
          icon: "info",
          title: t("map.no_geocoded_points"),
        });
        return;
      }

      const NEARBY_DISTANCE_METERS = 1000;

      const nearbyMissions = missionList.filter(mission => {
        if (!mission.location || !Array.isArray(mission.location)) return false;
        return mission.location.some(loc => {
          if (typeof loc.lat !== "number" || typeof loc.lng !== "number") return false;
          const d = calculateDistance(position.lat, position.lng, loc.lat, loc.lng);
          return d <= NEARBY_DISTANCE_METERS;
        });
      });

      if (!nearbyMissions || nearbyMissions.length === 0) {
        await ReactSwal.fire({
          icon: "info",
          title: t("map.no_nearby_points"),
        });
        return;
      }

      setFilteredMissionList(nearbyMissions);
      setIsFinded(true);
    } catch (err) {
      await handleGeolocationError(err, t, router);
    }
  };

  return (
    <OptionalAuthContainer>
      <Container
        maxWidth={false}
        sx={{
          display: "flex",
          flexDirection: "column",
          py: 4,
          gap: 1,
          height: "100%",
        }}
      >
        <Stack direction="row" spacing={2} pb={1} alignItems="center" zIndex={2}>
          <TextField
            value={searchStr}
            fullWidth
            onChange={e => setSearchStr(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Stack>

        <Stack direction="row" spacing={2} pb={1} alignItems="center" zIndex={2}>
          <Button fullWidth variant="contained" onClick={handleLocate}>
            {isLocating && (
              <CircularProgress size={20} thickness={5} sx={{ color: "white", mr: 1 }} />
            )}

            {isFinded ? t("home.show_all_missions") : t("home.find_nearby")}
          </Button>
        </Stack>

        <Box zIndex={2}>
          <Typography color="textSecondary" px={1}>
            {t("mission.category.title")}
          </Typography>

          {categoryList?.length > 0 && (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                py: 1,
                flexWrap: "nowrap",
                overflowX: "auto",
                px: 1,
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {categoryList.map(category => (
                <ButtonBase
                  key={category.value}
                  sx={{
                    backgroundColor:
                      selectedCategory === category.value ? palette.colors.c5 : palette.colors.c13,
                    border:
                      selectedCategory === category.value
                        ? `2px solid ${palette.colors.c7}`
                        : "2px solid transparent",
                    py: 0.5,
                    px: 2,
                    borderRadius: 99,
                    whiteSpace: "nowrap",
                    color: "white",
                    fontWeight: "bold",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                  onClick={() => handleCategorySelect(category.value)}
                >
                  {category.label}
                </ButtonBase>
              ))}
            </Box>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            p: 2,
            backgroundColor: palette.background.paper,
            borderRadius: "32px",
            flex: 1,
            overflowY: "auto",
            zIndex: 2,
            border: `1px solid ${palette.colors.c5}`,
          }}
        >
          {filteredMissionList.length === 0 && (
            <Stack alignItems="center" spacing={2} py={4}>
              <Typography variant="h6" color="textSecondary">
                {t("mission.no_missions")}
              </Typography>
            </Stack>
          )}

          {filteredMissionList.map(mission => (
            <ButtonBase
              component={Link}
              href={`/missions/${mission.slug}`}
              key={mission.id}
              sx={{
                display: "flex",
                p: 2,
                borderRadius: "24px",
                gap: 2,
                backgroundColor: getMissionColor(mission.code),
              }}
            >
              <Box
                component={"img"}
                sx={{
                  width: 90,
                  height: "auto",
                  aspectRatio: "1 / 1",
                  objectFit: "contain",
                  borderRadius: 2,
                }}
                src={
                  mission.coverImage
                    ? mission.coverImage
                    : "/assets/images/default-image-placeholder.svg"
                }
              />
              <Stack spacing={1} width={"100%"}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="h6" color="white">
                    {mission.name}
                  </Typography>
                  {completedMissionIds.has(mission.id) && (
                    <CheckCircleIcon
                      sx={{
                        position: "absolute",
                        right: -4,
                        top: -4,
                        color: palette.primary.main,
                        backgroundColor: "white",
                        borderRadius: "50%",
                        fontSize: "1.5rem",
                      }}
                    />
                  )}
                </Box>
                <Divider
                  sx={{
                    borderColor: "white",
                  }}
                />
                <Typography color="white">{mission.address || "-"}</Typography>

                <Typography
                  style={{
                    color: "white",
                    textDecoration: "underline",
                  }}
                >
                  {t("mission.view_details")}
                </Typography>
              </Stack>
            </ButtonBase>
          ))}
        </Box>

        <Box
          component={"img"}
          src="/assets/images/mission-list-bg.png"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "110%",
            height: "110%",
            objectFit: "cover",
            filter: "brightness(0.9) blur(4px)",
            m: -1,
          }}
        />
      </Container>
    </OptionalAuthContainer>
  );
}
