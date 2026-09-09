"use client";
import { RewardApi } from "@/data/RewardApi";
import ReactSwal from "@/helper/AlertHelper";
import { missionTypeStyles } from "@/helper/GlobalValueHelper";
import { useRouter } from "@/i18n/navigation";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import BottomColorBar from "../common/BottomColorBar";
import FullScreenLoading from "../common/FullScreenLoading";
import MissionPageLayout from "./MissionPageLayout";
import { sendConversion } from "@/helper/GAHelper";

export default function MissionTamjaiSamgor({ mission, isActive, type }) {
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const [redeemCode, setRedeemCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const redeem = async () => {
    if (!redeemCode.trim()) {
      ReactSwal.fire({
        icon: "error",
        title: t("mission.error"),
        text: t("mission.please_enter_code"),
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await RewardApi.redeemCode(redeemCode.trim(), type, locale);

      if (result.success) {
        await ReactSwal.fire({
          icon: "success",
          title: t("layout.success"),
          text: result.is_first_completion
            ? t("mission.redeem_success_first")
            : t("mission.redeem_success_already_completed"),
        });

        // Redirect to mission result page or home
        sendConversion("redeem_code", { type });
        router.push("/rewards");
      }
    } catch (error) {
      console.error("Redeem error:", error);

      ReactSwal.fire({
        icon: "error",
        title: t("error.title"),
        text: t(error.response.data.message),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MissionPageLayout>
      <FullScreenLoading open={isLoading} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          // justifyContent: "center",
          py: 2,
          gap: 2,
          flex: 1,
          width: "100%",
        }}
      >
        <Box
          component={"img"}
          src={
            mission.coverImage ? mission.coverImage : "/assets/images/default-image-placeholder.svg"
          }
          sx={{
            maxWidth: "50%",
            height: "auto",
            // borderRadius: 99,
            // backgroundColor: "white",
            // border: `4px solid ${palette.colors.c6}`,
          }}
        />

        <Box
          sx={{
            px: 4,
            py: 3,
            backgroundColor: "#C8AF7E",
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="h6" color="white">
            {t("mission.tamjai.enter_code_label")}
          </Typography>
          <TextField value={redeemCode} onChange={e => setRedeemCode(e.target.value)} />
        </Box>

        <Box
          component={"a"}
          href={
            type == "tamjai"
              ? "https://tamjaimixian.com/store-locator/"
              : "https://www.tjsamgor.com/hk/store-locator/"
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          <Typography
            variant="h6"
            sx={{
              textDecoration: "underline",
            }}
          >
            {t("mission.tamjai.view_branches")}
          </Typography>
        </Box>

        <Typography variant="body1" color="textSecondary" textAlign={"center"} px={6}>
          {t("mission.tamjai.complete_app_mission")}
        </Typography>
      </Box>

      <Box>
        {isActive ? (
          <Button variant="contained" onClick={redeem} disabled={!redeemCode || isLoading}>
            {t("mission.redeem")}
          </Button>
        ) : (
          <Button variant="contained" disabled>
            {t("mission.not_active")}
          </Button>
        )}
      </Box>

      <BottomColorBar color={missionTypeStyles(mission.type).color} />
    </MissionPageLayout>
  );
}
