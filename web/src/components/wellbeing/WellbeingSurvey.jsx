"use client";

import { WellBeingApi } from "@/data/WellBeingApi";
import ReactSwal from "@/helper/AlertHelper";
import { useRouter } from "@/i18n/navigation";
import { useAppSelector } from "@/lib/hooks";
import palette from "@/styles/theme/palette";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useState } from "react";
import AuthContainer from "../common/AuthContainer";
import HeaderBanner from "../common/HeaderBanner";
import { sendFormSubmit } from "@/helper/GAHelper";

export default function WellbeingSurvey() {
  const t = useTranslations("wellbeing");
  const router = useRouter();
  const user = useAppSelector(state => state.user);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalQuestions = 20;

  const options = [
    { value: 1, label: t("options.strongly_disagree") },
    { value: 2, label: t("options.disagree") },
    { value: 3, label: t("options.neutral") },
    { value: 4, label: t("options.agree") },
    { value: 5, label: t("options.strongly_agree") },
  ];

  const handleAnswerChange = (questionNumber, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionNumber]: parseInt(value),
    }));
  };

  const calculateScore = () => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    // Convert from 20-100 range to 0-100 range
    // Formula: ((totalScore - 20) / 80) * 100
    // const normalizedScore = ((totalScore - 20) / 80) * 100;
    return Math.round(totalScore * 10) / 10; // Round to 1 decimal place
  };

  const handleSubmit = async () => {
    const score = calculateScore();

    console.log("Submitting survey...", score);
    if (!user || !user.id) {
      await ReactSwal.fire({
        icon: "error",
        title: t("error"),
        text: t("please_login"),
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const score = calculateScore();

      // Submit to backend API
      await WellBeingApi.create({
        memberId: user.id,
        wellbeingScore: score,
        surveyAnswers: answers,
      });

      console.log("Wellbeing Survey Answers:", answers);
      console.log("Wellbeing Index Score:", score);

      // Redirect to result page
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get("redirect");
      const resultUrl = `/wellbeing/result?score=${score}${redirect ? `&redirect=${encodeURIComponent(redirect)}` : ""}`;
      sendFormSubmit("wellbeing_survey");
      router.push(resultUrl);
    } catch (error) {
      console.error("Failed to submit survey:", error);
      await ReactSwal.fire({
        icon: "error",
        title: t("submit_error"),
        text: error.message || t("please_try_again"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (Object.keys(answers).length / totalQuestions) * 100;
  const isComplete = Object.keys(answers).length === totalQuestions;

  return (
    <AuthContainer>
      <Box
        sx={{
          backgroundImage: "url('/assets/images/wellbeing-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "bottom",
          backgroundRepeat: "no-repeat",
          height: "100%",
          width: "100%",
          display: "flex",
          position: "relative",
          overflowX: "hidden",
          flexDirection: "column",
        }}
      >
        <HeaderBanner
          title={t("title")}
          leftIcon="/assets/icons/girl.png"
          rightIcon="/assets/icons/stamp.svg"
          backgroundColor="#C88FBB"
          fullWidth
        />
        <Container
          maxWidth={false}
          sx={{ position: "relative", overflowY: "auto", overflowX: "hidden" }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              py: 8,
              overflowX: "hidden",
            }}
          >
            {Array.from({ length: totalQuestions }, (_, i) => i + 1).map(questionNumber => (
              <Card
                key={questionNumber}
                sx={{
                  mb: 2,
                  borderRadius: 4,
                  backgroundColor: palette.background.paper,
                }}
              >
                <CardContent>
                  <Typography gutterBottom>
                    {questionNumber}. {t(`questions.q${questionNumber}`)}
                  </Typography>

                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                      value={answers[questionNumber] || ""}
                      onChange={e => handleAnswerChange(questionNumber, e.target.value)}
                    >
                      {options.map(option => {
                        const isSelected = answers[questionNumber] === option.value;
                        return (
                          <FormControlLabel
                            key={option.value}
                            value={option.value}
                            control={
                              <Radio
                                size="small"
                                sx={{ color: "white", "&.Mui-checked": { color: "white" } }}
                              />
                            }
                            label={option.label}
                            slotProps={{ typography: { variant: "body1" } }}
                            sx={{
                              backgroundColor: isSelected
                                ? palette.primary.main
                                : palette.colors.c13,
                              border: "1px solid",
                              borderColor: isSelected ? palette.primary.main : "divider",
                              borderRadius: 2,
                              mb: 1,
                              mx: 0,
                              px: 1,
                              color: "white",
                              // "&:hover": {
                              //   backgroundColor: isSelected ? palette.primary.dark : "action.hover",
                              // },
                            }}
                          />
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                </CardContent>

                <CardActionArea />
              </Card>
            ))}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={!isComplete || isSubmitting}
                sx={{ minWidth: 200 }}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isSubmitting ? t("submitting") : t("submit")}
              </Button>
            </Box>

            {!isComplete && (
              <Typography variant="body2" color="error" align="center" sx={{ mt: 2 }}>
                {t("please_answer_all")}
              </Typography>
            )}

            <Box pt={2} sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="caption">{t("disclaimer_title")}</Typography>
              <Typography variant="caption">{t("disclaimer_content")}</Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </AuthContainer>
  );
}
