"use client";
import { MemberApi } from "@/data/MemberApi";
import { MissionRecordApi } from "@/data/MissionRecordApi";
import { WellBeingApi } from "@/data/WellBeingApi";
import ReactSwal from "@/helper/AlertHelper";
import { sendButtonClick } from "@/helper/GAHelper";
import {
  handleGeolocationError,
  obtainLocation,
  obtainLocationAndDistance,
} from "@/helper/GeolocationHelper";
import { useRouter } from "@/i18n/navigation";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useLocale, useTranslations } from "use-intl";

export default function MissionStartButton({ mission, onStart }) {
  const t = useTranslations();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const locale = useLocale();
  const [isWithinRange, setIsWithinRange] = useState(true);

  const MAX_DISTANCE = 100; // default to 100 meters if not specified

  const checkSmsVerification = async () => {
    try {
      const { isSmsVerified } = await MemberApi.checkSmsVerificationStatus();

      if (!isSmsVerified) {
        ReactSwal.fire({
          icon: "warning",
          title: t("sms_verification.required_title"),
          text: t("sms_verification.required_message"),
        }).then(() => {
          window.location.href = `/${locale}/members/phone-verification?redirect=${window.location.pathname}`;
        });

        return false;
      }

      return true;
    } catch (error) {
      // 401/403: AxiosHelper auto-redirects to login; block proceeding for all errors
      console.error("Failed to check SMS verification status:", error);
      await ReactSwal.fire({
        icon: "error",
        title: t("error.title"),
        text: t(error?.message ?? t("error.unknown")),
      });
      return false;
    }
  };

  const fetchMissionRecordList = async () => {
    try {
      const response = await MissionRecordApi.listMy(1, 30);

      console.log("Fetched mission records:", response.data);
      return response.data;
    } catch (err) {
      console.error("Failed to fetch mission records:", err);
      return [];
    }
  };

  const fetchWellBeingList = async () => {
    try {
      const response = await WellBeingApi.listMy(1, 5);

      console.log("Fetched well-being records:", response.data);
      return response.data;
    } catch (err) {
      console.error("Failed to fetch well-being records:", err);
      return [];
    }
  };

  const checkSurveyCompletion = async () => {
    try {
      const missionRecordList = await fetchMissionRecordList();
      const wellBeingList = await fetchWellBeingList();

      const missionCount = missionRecordList.length;
      const surveyCount = wellBeingList.length;

      console.log("Mission count:", missionCount, "Survey count:", surveyCount);

      // Condition 1: If the user has 3 mission records but 0 survey records, require filling out the survey
      if (missionCount >= 3 && surveyCount === 0) {
        await ReactSwal.fire({
          icon: "warning",
          title: t("survey.required_title"),
          text: t("survey.first_survey_required"),
          confirmButtonText: t("survey.go_to_survey"),
        });
        window.location.href = `/${locale}/wellbeing?redirect=${window.location.pathname}`;
        return false;
      }

      // Condition 2: If the user has more than 20 mission records, they must complete the survey again
      if (missionCount > 20 && surveyCount < 2) {
        await ReactSwal.fire({
          icon: "warning",
          title: t("survey.required_title"),
          text: t("survey.second_survey_required"),
          confirmButtonText: t("survey.go_to_survey"),
        });
        window.location.href = `/${locale}/wellbeing?redirect=${window.location.pathname}`;
        return false;
      }

      return true;
    } catch (error) {
      console.error("Failed to check survey completion:", error);
      await ReactSwal.fire({
        icon: "error",
        title: t("error.title"),
        text: t(error?.message ?? t("error.unknown")),
      });
      return true; // allow to proceed in case of error
    }
  };

  const shouldSkipGps = (mission) => { 
    if (process.env.NEXT_PUBLIC_SKIP_GPS_GUARD) {
      return true;
    }
    return mission?.parameter?.skip_gps;
  }

  const handleStart = async () => {
    sendButtonClick("location_request", { mission_slug: mission.slug });
    setLoading(true);
    setIsWithinRange(true);

    try {
      // Check SMS verification
      const smsVerified = await checkSmsVerification();
      if (!smsVerified) return;

      // Check survey completion
      const surveyCompleted = await checkSurveyCompletion();
      if (!surveyCompleted) return;

      // Skip GPS if configured
      if (!shouldSkipGps(mission)) {
        // Obtain user position
        let position;
        try {
          ({ position } = await obtainLocation({
            enableHighAccuracy: true,
            timeout: 50000,
            maximumAge: 0,
          }));
        } catch (err) {
          sendButtonClick("location_failed", {
            mission_slug: mission.slug,
            error: err?.code ?? err?.message ?? "unknown",
          });
          await handleGeolocationError(err, t, router);
          return;
        }

        // Compute min distance to mission locations
        let minDistance = null;
        let nearestLoc = null;
        try {
          const res = obtainLocationAndDistance(position, mission?.location);
          minDistance = res?.distance ?? null;
          nearestLoc = res?.location ?? null;
        } catch (e) {
          console.error("Failed to compute min distance:", e);
          await ReactSwal.fire({
            icon: "error",
            title: t("error.gps.invalid_location_format"),
          });
          return;
        }

        if (minDistance !== null) {
          console.log(
            "Minimum distance to mission location:",
            minDistance,
            "meters",
            "Location:",
            nearestLoc,
          );
          const maxDistance = nearestLoc?.maxDistance || MAX_DISTANCE;
          if (minDistance > maxDistance) {
            sendButtonClick("location_out_of_range", {
              mission_slug: mission.slug,
              distance: Math.round(minDistance),
            });
            setIsWithinRange(false);
            const result = await ReactSwal.fire({
              icon: "error",
              title: t("error.gps.out_of_range"),
              text: t("error.gps.out_of_range_hint"),
              showCancelButton: true,
              confirmButtonText: t("error.gps.view_solution"),
              cancelButtonText: t("mission.start_button.retry_location"),
            });
            if (result.isConfirmed) {
              router.push("/gps-guide");
            }
            return;
          }
        }

        sendButtonClick("location_success", { mission_slug: mission.slug });
      }

      // All checks passed — start mission
      sendButtonClick("mission_start", { mission_slug: mission.slug });
      onStart();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="contained"
      fullWidth
      onClick={handleStart}
      disabled={loading}
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
    >
      {loading
        ? t("mission.start_button.requesting_location")
        : isWithinRange
          ? t("mission.start_button.start_mission")
          : t("mission.start_button.retry_location")}
    </Button>
  );
}
