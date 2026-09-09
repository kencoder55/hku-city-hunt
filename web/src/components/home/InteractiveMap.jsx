"use client";
import { MissionRecordApi } from "@/data/MissionRecordApi";
import ReactSwal from "@/helper/AlertHelper";
import { handleGeolocationError, obtainLocation } from "@/helper/GeolocationHelper";
import { getMissionColor } from "@/helper/GlobalValueHelper";
import { calculateDistance, getTranslationField } from "@/helper/UnitsHelper";
import { useRouter } from "@/i18n/navigation";
import { Box } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import InfoDialog from "../common/InfoDialog";
import MapControls from "./MapControls";
import MapPoint from "./MapPoint";
import NearbyButton from "./NearbyButton";
import { useAppSelector } from "@/lib/hooks";
import OptionalAuthContainer from "../common/OptionalAuthContainer";

const MAP_WIDTH = 3000; // in pixels
const MAP_HEIGHT = 3000; // in pixels

export default function InteractiveMap({ initialMissions = [] }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const transformRef = useRef(null);
  const [clickPosition, setClickPosition] = useState(null);
  const [mapPoints, setMapPoints] = useState([]); // original full list of points
  const [filteredPoints, setFilteredPoints] = useState([]); // points after filtering by location
  const [zoomLevel, setZoomLevel] = useState(1);
  const locale = useLocale();
  const t = useTranslations();
  const [isFinded, setIsFinded] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [completedMissionIds, setCompletedMissionIds] = useState(new Set());
  const user = useAppSelector(state => state.user);

  useEffect(() => {
    initMap();
  }, [initialMissions]);

  useEffect(() => {
    if (user && user.id) {
      fetchUserMissionRecords();
    } else {
      setCompletedMissionIds(new Set());
    }
  }, [user]);

  const initMap = async () => {
    try {
      processInitialMissions(initialMissions);
    } catch (error) {
      console.error("Error loading missions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserMissionRecords = async () => {
    try {
      if (!user || !user.id) {
        return;
      }

      const response = await MissionRecordApi.listMy(1, null, locale);
      const records = response.data || [];

      console.log("Fetched mission records:", records);

      // Extract completed mission IDs
      const completedIds = new Set(records.map(record => record.missionId));
      setCompletedMissionIds(completedIds);
    } catch (error) {
      console.error("Error fetching mission records:", error);
      // Don't throw error, just log it - user might not be logged in
    }
  };

  const processInitialMissions = missions => {
    try {
      console.log("Processing initial missions:", missions);

      const points = missions.flatMap((mission, missionIndex) =>
        mission.location.map((loc, locIndex) => ({
          ...loc,
          name: mission.name,
          missionId: mission.id,
          coverImage: mission.coverImage,
          description: mission.description,
          color: getMissionColor(mission.code),
          wellnessMessage: mission.wellnessMessage,
          slug: mission.slug,
          location: loc[getTranslationField("name", locale, "camelCase")] || "",
          uniqueKey: `${mission.id}-${loc.code}-${missionIndex}-${locIndex}`,
        })),
      );

      console.log("Map points:", points);

      setMapPoints(points);
      setFilteredPoints(points);
    } catch (error) {
      console.error("Error processing missions:", error);
    }
  };

  const handlePointClick = point => {
    setSelectedPoint(point);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);

    setTimeout(() => {
      setSelectedPoint(null);
    }, 300);
  };

  const handleZoomIn = () => {
    if (transformRef.current) {
      transformRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (transformRef.current) {
      transformRef.current.zoomOut();
    }
  };

  const handleMapClick = e => {
    if (e.target.tagName === "BUTTON" || e.target.closest("button")) {
      return;
    }

    const imgElement = e.currentTarget;
    const rect = imgElement.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    // setClickPosition({ x: x.toFixed(2), y: y.toFixed(2) });
    console.log(`X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}`);
  };

  const getPointSize = () => {
    if (zoomLevel < 1.5) {
      return 32; // default size
    } else if (zoomLevel < 3) {
      return 16; // smaller
    } else if (zoomLevel < 4) {
      return 12; // even smaller
    } else {
      return 6; // smallest
    }
  };

  const handleTransform = ref => {
    if (ref && ref.state) {
      setZoomLevel(ref.state.scale);
    }
  };

  const handleNavigateToMission = slug => {
    router.push(`/missions/${slug}`);
  };

  const handleLocate = async () => {
    try {
      if (isFinded) {
        // reset filter
        setFilteredPoints(mapPoints);
        setIsFinded(false);
        zoomToFitPoints(mapPoints);
        return;
      }

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

      // find nearest map point by lat/lng
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

      // compute distances and filter by a fixed nearby radius (ignore point maxDistance)
      const NEARBY_DISTANCE_METERS = 1000; // fixed nearby radius in meters
      const withinPoints = validPoints
        .map(p => {
          const d = calculateDistance(position.lat, position.lng, p.lat, p.lng);
          return { point: p, distance: Math.round(d) };
        })
        .filter(item => item.distance <= NEARBY_DISTANCE_METERS);

      if (withinPoints && withinPoints.length > 0) {
        setFilteredPoints(withinPoints.map(item => item.point));
        setIsFinded(true);
        // zoom to fit nearby points
        zoomToFitPoints(withinPoints.map(item => item.point));
      } else {
        await ReactSwal.fire({
          icon: "info",
          title: t("map.no_nearby_points"),
        });
        // reset to show all points
        setFilteredPoints(mapPoints);
        setIsFinded(false);
      }
    } catch (err) {
      setIsLocating(false);
      await handleGeolocationError(err, t, router);
    }
  };

  const zoomToFitPoints = points => {
    try {
      if (!points || points.length === 0 || !transformRef.current) return;

      // convert percentage x/y to pixel coordinates on image
      const px = points.map(p => {
        const xPercent = parseFloat(p.x ?? p.lng ?? 0);
        const yPercent = parseFloat(p.y ?? p.lat ?? 0);
        return {
          x: isNaN(xPercent) ? 0 : (xPercent / 100) * MAP_WIDTH,
          y: isNaN(yPercent) ? 0 : (yPercent / 100) * MAP_HEIGHT,
        };
      });

      const minX = Math.min(...px.map(p => p.x));
      const maxX = Math.max(...px.map(p => p.x));
      const minY = Math.min(...px.map(p => p.y));
      const maxY = Math.max(...px.map(p => p.y));

      const bboxW = Math.max(16, maxX - minX);
      const bboxH = Math.max(16, maxY - minY);

      // determine viewport size from wrapper if available
      let vw = window.innerWidth;
      let vh = window.innerHeight;
      let wrapperEl = null;
      try {
        wrapperEl =
          transformRef.current.wrapperComponent ||
          document.querySelector(".react-transform-wrapper");
        if (wrapperEl && typeof wrapperEl.getBoundingClientRect === "function") {
          const r = wrapperEl.getBoundingClientRect();
          vw = r.width;
          vh = r.height;
        }
      } catch (e) {
        // fallback to window
      }

      const PADDING = 64; // px
      const scaleX = (vw - PADDING) / bboxW;
      const scaleY = (vh - PADDING) / bboxH;
      let targetScale = Math.min(scaleX, scaleY);

      const MIN_SCALE = 0.45;
      const MAX_SCALE = 6;

      if (points.length === 1) {
        // when single point, zoom in a bit for focus
        targetScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, 2));
      }

      if (!isFinite(targetScale) || targetScale <= 0) targetScale = MIN_SCALE;
      targetScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, targetScale));

      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;

      const posX = -centerX * targetScale + vw / 2;
      const posY = -centerY * targetScale + vh / 2;

      if (transformRef.current && typeof transformRef.current.setTransform === "function") {
        transformRef.current.setTransform(posX, posY, targetScale, 400);
      } else if (transformRef.current && typeof transformRef.current.centerView === "function") {
        transformRef.current.centerView();
      }
    } catch (err) {
      console.error("zoomToFitPoints failed:", err);
    }
  };

  return (
    <OptionalAuthContainer>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          backgroundColor: "#bbe9fd",
          overflow: "hidden",
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.5s ease-in-out",
          position: "relative",
        }}
      >
        <TransformWrapper
          ref={transformRef}
          initialScale={1}
          minScale={0.45}
          maxScale={6}
          centerOnInit
          onTransformed={handleTransform}
        >
          <TransformComponent
            wrapperStyle={{
              width: "100%",
              height: "100%",
            }}
            contentStyle={{
              cursor: "crosshair",
            }}
          >
            <Box
              sx={{ position: "relative", width: "100%", height: "100%" }}
              onClick={handleMapClick}
            >
              <Box
                component="img"
                src="/assets/images/map.svg"
                alt="map"
                sx={{
                  width: MAP_WIDTH,
                  height: MAP_HEIGHT,
                  display: "block",
                  pointerEvents: "auto",
                }}
              />
              {filteredPoints.map(point => (
                <MapPoint
                  key={point.uniqueKey}
                  point={point}
                  onClick={handlePointClick}
                  size={getPointSize()}
                  isCompleted={completedMissionIds.has(point.missionId)}
                />
              ))}
            </Box>
          </TransformComponent>
        </TransformWrapper>

        <MapControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onLocate={handleLocate} />

        <NearbyButton onClick={handleLocate} loading={isLocating} isFinded={isFinded} />

        {clickPosition && (
          <Box
            sx={{
              position: "absolute",
              top: 20,
              left: 20,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              color: "white",
              padding: "8px 16px",
              borderRadius: "4px",
              fontFamily: "monospace",
              fontSize: "14px",
              zIndex: 1000,
            }}
          >
            X: {clickPosition.x}%, Y: {clickPosition.y}%
          </Box>
        )}

        <InfoDialog
          open={openDialog}
          image={
            selectedPoint?.coverImage
              ? selectedPoint.coverImage
              : "/assets/images/default-image-placeholder.svg"
          }
          title={selectedPoint?.name}
          message={selectedPoint?.wellnessMessage}
          remark={selectedPoint?.location}
          confirmText={t("layout.enter_mission")}
          onConfirm={() => handleNavigateToMission(selectedPoint?.slug)}
          onClose={handleCloseDialog}
          backgroundColor={selectedPoint?.color || "#fff"}
        />
      </Box>
    </OptionalAuthContainer>
  );
}
