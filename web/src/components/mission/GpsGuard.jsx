"use client";

import ReactSwal from "@/helper/AlertHelper";
import {
  handleGeolocationError,
  obtainLocation,
  obtainLocationAndDistance,
} from "@/helper/GeolocationHelper";
import { useRouter } from "@/i18n/navigation";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const MAX_DISTANCE = 100;

/**
 * Client-side GPS guard that re-verifies the user is within range before
 * showing mission content. Prevents players from bypassing the MissionHome
 * GPS check by directly navigating to /missions/[slug]/start.
 *
 * Skipped when:
 *  - mission.parameter.skip_gps is truthy
 *  - mission.location is empty / null (no GPS required)
 */
export default function GpsGuard({ mission, children }) {
  const t = useTranslations();
  const router = useRouter();

  const [status, setStatus] = useState("checking"); // "checking" | "ok" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  
  useEffect(() => {
    console.log("GpsGuard useEffect");
    // Add env flag to skip GPS guard
    console.log("NEXT_PUBLIC_SKIP_GPS_GUARD", process.env.NEXT_PUBLIC_SKIP_GPS_GUARD);
    if (process.env.NEXT_PUBLIC_SKIP_GPS_GUARD) {
      setStatus("ok");
      return;
    }

    // Skip GPS guard entirely
    if (mission?.parameter?.skip_gps) {
      setStatus("ok");
      return;
    }

    const locs = mission?.location;
    if (!locs || (Array.isArray(locs) && locs.length === 0)) {
      setStatus("ok");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const { position } = await obtainLocation({
          enableHighAccuracy: true,
          timeout: 50000,
          maximumAge: 0,
        });

        if (cancelled) return;

        const res = obtainLocationAndDistance(position, locs);

        if (!res) {
          // No location data to check against
          setStatus("ok");
          return;
        }

        const { distance, location: nearestLoc } = res;
        const maxDistance = nearestLoc?.maxDistance || MAX_DISTANCE;
        console.log("distance", distance);
        console.log("maxDistance", maxDistance);

        if (distance > maxDistance) {
          const result = await ReactSwal.fire({
            icon: "error",
            title: t("error.gps.out_of_range"),
            text: t("error.gps.out_of_range_hint"),
            showCancelButton: true,
            confirmButtonText: t("error.gps.view_solution"),
            cancelButtonText: t("mission.start_button.retry_location"),
          });

          if (cancelled) return;

          if (result.isConfirmed) {
            router.push("/gps-guide");
          } else {
            // Retry — go back to mission home
            router.back();
          }
          setStatus("error");
          setErrorMsg(t("error.gps.out_of_range"));
        } else {
          setStatus("ok");
        }
      } catch (err) {
        if (cancelled) return;
        await handleGeolocationError(err, t, router);
        setStatus("error");
        setErrorMsg(t("error.gps.unknown_error"));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "checking") {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 2,
          p: 4,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          {t("mission.start_button.requesting_location")}
        </Typography>
      </Box>
    );
  }

  if (status === "error") {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 2,
          p: 4,
        }}
      >
        <Typography color="error">{errorMsg}</Typography>
        <Button variant="contained" onClick={() => router.back()}>
          {t("layout.back")}
        </Button>
      </Box>
    );
  }

  // status === "ok"
  return children;
}
