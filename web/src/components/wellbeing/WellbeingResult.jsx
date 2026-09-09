"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import HeaderBanner from "../common/HeaderBanner";
import ContentCard from "../common/ContentCard";

export default function WellbeingResult() {
  const t = useTranslations("wellbeing");
  const router = useRouter();
  const searchParams = useSearchParams();
  const score = parseInt(searchParams.get("score") || "0");

  // Determine result category based on score
  const getResultCategory = () => {
    if (score <= 65) return "low";
    if (score >= 66 && score <= 78) return "average";
    return "high"; // score >= 79
  };

  const getCategoryColor = category => {
    switch (category) {
      case "high":
        return "#93CE6D";
      case "average":
        return "#D1BA53";
      case "low":
        return "#FF9992";
      default:
        return "#93CE6D";
    }
  };

  const category = getResultCategory();
  const categoryColor = getCategoryColor(category);
  const resultTitle = t(`result.${category}.title`);
  const resultDescription = t(`result.${category}.description`);

  const handleContinue = () => {
    const redirect = searchParams.get("redirect");
    if (redirect) {
      router.push(redirect);
    } else {
      router.push("/");
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: "url('/assets/images/wellbeing-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "bottom",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        flexDirection: "column",
      }}
    >
      <HeaderBanner
        title={t("title")}
        leftIcon="/assets/icons/success-1.svg"
        rightIcon="/assets/icons/stamp.svg"
        backgroundColor="#C88FBB"
        fullWidth
      />
      <Container
        maxWidth="sm"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 4,
          overflow: "hidden",
        }}
      >
        <ContentCard title={t("result_title")}>
          <Typography
            variant="h6"
            gutterBottom
            textAlign="center"
            sx={{
              backgroundColor: categoryColor,
              color: "white",
              p: 1,
              fontWeight: 500,
              borderRadius: 99,
            }}
          >
            {resultTitle}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              whiteSpace: "pre-line",
              mt: 2,
              lineHeight: 1.8,
              fontWeight: 500,
            }}
          >
            {resultDescription}
          </Typography>
        </ContentCard>

        <Button
          variant="contained"
          size="large"
          onClick={handleContinue}
          sx={{ mt: 2, minWidth: 200 }}
        >
          {t("complete")}
        </Button>
      </Container>
    </Box>
  );
}
