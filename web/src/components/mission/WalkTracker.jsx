"use client";
import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Typography, Paper, Stack } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useTranslations } from "next-intl";
import ReactSwal from "@/helper/AlertHelper";
import { calculateDistance } from "@/helper/UnitsHelper";
import ReactPlayer from "react-player";
import palette from "@/styles/theme/palette";

export default function WalkTracker({ mission, onFinish }) {
  const t = useTranslations();
  const [isTracking, setIsTracking] = useState(false);
  const [totalDistance, setTotalDistance] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const watchIdRef = useRef(null);
  const lastPositionRef = useRef(null);

  const REQUIRED_DISTANCE = mission.parameter?.required_distance || 10; // meters

  useEffect(() => {
    startTracking();

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const startTracking = () => {
    if (!navigator.geolocation) {
      const msg = t("error.gps.geolocation_not_supported");
      setLocationError(msg);
      ReactSwal.fire({
        icon: "error",
        title: t("error.title"),
        text: msg,
      });
      return;
    }

    setIsTracking(true);
    setLocationError(null);

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    const handlePosition = position => {
      const { latitude, longitude } = position.coords;

      if (lastPositionRef.current) {
        const distance = calculateDistance(
          lastPositionRef.current.latitude,
          lastPositionRef.current.longitude,
          latitude,
          longitude,
        );

        console.log(`Distance moved: ${distance.toFixed(2)} meters`);

        setTotalDistance(prev => {
          const newDistance = prev + distance;
          if (newDistance >= REQUIRED_DISTANCE) {
            setIsCompleted(true);
            stopTracking();
            onFinish(distance);
          }
          return newDistance;
        });
      }

      lastPositionRef.current = { latitude, longitude };
    };

    const handleError = error => {
      console.error("Geolocation error:", error);
      let errorMessage = t("error.gps.unknown_error");

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = t("error.gps.permission_denied");
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = t("error.gps.position_unavailable");
          break;
        case error.TIMEOUT:
          // don't spam timeout errors
          // errorMessage = t("error.gps.timeout");
          break;
      }

      setLocationError(errorMessage);
      setIsTracking(false);
      ReactSwal.fire({
        icon: "error",
        title: t("error.title"),
        text: errorMessage,
      });
    };

    watchIdRef.current = navigator.geolocation.watchPosition(handlePosition, handleError, options);
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      <Box
        sx={{
          px: 4,
          py: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          backgroundColor: "white",
          border: `3px solid ${palette.colors.c7}`,
          borderRadius: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 150,
            height: 150,
            borderRadius: 99,
            overflow: "hidden",
            color: "white",
          }}
        >
          {isCompleted ? (
            <CheckCircleIcon sx={{ fontSize: 120, color: palette.primary.main }} />
          ) : (
            <ReactPlayer
              src="/assets/videos/waking.mp4"
              playing
              muted
              loop
              playsInline
              controls={false}
            />
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Stack direction={"row"} alignItems={"center"} gap={1}>
            <Typography variant="h2" fontWeight="bold" color="primary">
              {totalDistance.toFixed(1)}
            </Typography>
            <Typography variant="h5">m</Typography>
          </Stack>

          <Stack direction={"row"} alignItems={"center"} gap={1}>
            <Typography variant="h5">/{REQUIRED_DISTANCE}m</Typography>
          </Stack>

          <Typography variant="h5" whiteSpace={"pre-line"} textAlign="center" pt={2}>
            {t("mission.walking.tips")}
          </Typography>
        </Box>

        {locationError && (
          <Typography variant="body2" color="error" textAlign="center">
            {locationError}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
