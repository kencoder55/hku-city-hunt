"use client";

import ValidationTextField from "@/components/common/ValidationTextField";
import { MemberApi } from "@/data/MemberApi";
import ReactSwal from "@/helper/AlertHelper";
import { Button, Container, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import * as Yup from "yup";

export default function EmailVerification() {
  const t = useTranslations();
  const locale = useLocale();
  const [countdown, setCountdown] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const schema = Yup.object().shape({
    code: Yup.string()
      .required(t("members.validation.required"))
      .length(6, t("members.email_verification.invalid_code_length")),
  });

  const formik = useFormik({
    initialValues: {
      code: "",
    },
    validateOnMount: true,
    validationSchema: schema,
  });

  useEffect(() => {
    // Auto-send the first verification code on page load
    handleSendCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setIsButtonDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  const handleSendCode = async () => {
    try {
      setIsButtonDisabled(true);
      setCountdown(60);
      setIsLoading(true);

      const success = await MemberApi.sendEmailVerificationCode();

      if (success) {
        ReactSwal.fire({
          icon: "success",
          title: t("members.email_verification.code_sent_success"),
        });
      } else {
        ReactSwal.fire({
          icon: "error",
          title: t("error.title"),
          html: t("members.email_verification.send_code_failed"),
        });
      }
    } catch (error) {
      ReactSwal.fire({
        icon: "error",
        title: t("error.title"),
        html: t(error.message || "error.unknown"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    try {
      formik.setTouched({ code: true });
      await formik.validateForm();

      if (!formik.isValid) return;

      setIsLoading(true);

      const success = await MemberApi.verifyEmail(formik.values.code);

      if (success) {
        window.location.href = `/${locale}/members/phone-verification`;
      } else {
        ReactSwal.fire({
          icon: "error",
          title: t("error.title"),
          html: t("members.email_verification.invalid_code"),
        });
      }
    } catch (error) {
      ReactSwal.fire({
        icon: "error",
        title: t("error.title"),
        html: t(error.message || "error.unknown"),
      });
      formik.setFieldValue("code", "");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Box
        component={"img"}
        src="/assets/icons/logo.svg"
        alt="NLPRA Logo"
        sx={{
          width: 200,
          maxWidth: "100%",
          height: "auto",
          py: 4,
        }}
      />

      <Typography variant="h6">{t("members.email_verification.title")}</Typography>

      <Typography color="textSecondary" textAlign="center">
        {t("members.email_verification.description")}
      </Typography>

      <Stack direction="column" gap={1} alignItems="center" width="100%">
        <ValidationTextField
          name="code"
          type="text"
          value={formik.values.code}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          title={t("members.email_verification.verification_code")}
          errorText={formik.errors.code}
          touched={formik.touched.code}
        />

        <Button
          variant="contained"
          onClick={handleSendCode}
          disabled={isButtonDisabled || isLoading}
          sx={{
            whiteSpace: "nowrap",
            px: 3,
            flexShrink: 0,
          }}
        >
          {countdown > 0
            ? `${countdown} ${t("members.email_verification.resend_after")}`
            : t("members.email_verification.send_code")}
        </Button>
      </Stack>

      <Box sx={{ width: "100%", mt: 2 }}>
        <Button
          variant="contained"
          fullWidth
          disabled={isLoading || !formik.isValid}
          onClick={handleSubmitCode}
        >
          {t("members.email_verification.submit_code")}
        </Button>
      </Box>
    </Container>
  );
}
