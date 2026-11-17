"use client";
import AppLayout from "@/components/common/AppLayout";
import AuthContainer from "@/components/common/AuthContainer";
import ValidationTextField from "@/components/common/ValidationTextField";
import { MemberApi } from "@/data/MemberApi";
import ReactSwal from "@/helper/AlertHelper";
import { sendButtonClick } from "@/helper/GAHelper";
import { useAppSelector } from "@/lib/hooks";
import { Turnstile } from "@marsidev/react-turnstile";
import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "use-intl";
import * as Yup from "yup";

export default function PhoneVerification() {
  const t = useTranslations();
  const locale = useLocale();
  const [countdown, setCountdown] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const schema = Yup.object().shape({
    phone: Yup.string()
      .required(t("members.validation.required"))
      // 8 digit Hong Kong phone number starting with 4,5,6,7,8,9
      .matches(/^(4|5|6|7|8|9)\d{7}$/, t("members.phone_verification.invalid_phone_number")),
    code: Yup.string()
      .required(t("members.validation.required"))
      .length(6, t("members.phone_verification.invalid_code_length")),
  });
  const user = useAppSelector(state => state.user);

  const formik = useFormik({
    initialValues: {
      phone: "",
      code: "",
    },
    validateOnMount: true,
    validationSchema: schema,
  });

  useEffect(() => {
    if (user.id && user.isSmsVerified) {
      // avoid user sees the phone verification page after refreshing when already verified, redirect to home page
      window.location.href = "/";
      return;
    }
  }, [user]);

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
      const response = await MemberApi.sendPhoneVerificationCode({
        captchaToken: token,
        phone: formik.values.phone,
        locale: locale,
      });

      if (response) {
        ReactSwal.fire({
          icon: "success",
          title: t("members.phone_verification.code_sent_success"),
          // html: `${t("members.phone_verification.your_code_is")} ${response.code}`,
        });
      } else {
        ReactSwal.fire({
          icon: "error",
          title: t("error.title"),
          html: t("members.phone_verification.send_code_failed"),
        });
      }
    } catch (error) {
      ReactSwal.fire({
        icon: "error",
        title: t("error.title"),
        html: t(error.message || "error.unknown"),
      });
    } finally {
      setCountdown(60);
      setIsLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    try {
      setIsLoading(true);
      const { success, result } = await MemberApi.verifyPhone(
        formik.values.phone,
        formik.values.code,
      );

      if (success) {
        sendButtonClick("phone_verified");
        window.location.href = `/${locale}/members/register/success`;
      } else {
        ReactSwal.fire({
          icon: "error",
          title: t("error.title"),
          html: t(result.message || "members.phone_verification.invalid_code"),
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
    <AuthContainer>
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
          src="/assets/icons/title-logo.png"
          alt="DNA 校園定向"
          sx={{
            width: 200,
            maxWidth: "100%",
            height: "auto",
            py: 4,
          }}
        />

        <ValidationTextField
          name="phone"
          disabled={countdown}
          type={"tel"}
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          title={t("members.phone_verification.mobile_number")}
          errorText={formik.errors.phone}
          touched={formik.touched.phone}
        />

        <Stack>
          <Typography color="textSecondary">
            {t("members.phone_verification.verification_code")}
          </Typography>
          <Stack direction={"row"} gap={1} alignItems={"center"}>
            <ValidationTextField
              name="code"
              type={"text"}
              value={formik.values.code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              touched={formik.touched.code}
            />

            <Button
              variant="contained"
              onClick={handleSendCode}
              disabled={
                isButtonDisabled ||
                !token ||
                !formik.values.phone ||
                !!formik.errors.phone ||
                isLoading
              }
              sx={{
                whiteSpace: "nowrap",
                px: 6,
              }}
            >
              {isButtonDisabled
                ? `${countdown}${t("members.phone_verification.resend_after")}`
                : t("members.phone_verification.send_code")}
            </Button>
          </Stack>

          {formik.errors.code && formik.touched.code && (
            <Typography color="error" variant="caption">
              {t(formik.errors.code)}
            </Typography>
          )}
        </Stack>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Turnstile
            theme={"light"}
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            onSuccess={token => setToken(token)}
            onExpire={() => setToken("")}
          />
        </Box>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSubmitCode}
          disabled={!formik.isValid || isLoading}
        >
          {t("members.phone_verification.submit_code")}
        </Button>
      </Container>
    </AuthContainer>
  );
}
