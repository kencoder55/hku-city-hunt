"use client";
import ValidationTextField from "@/components/common/ValidationTextField";
import { MemberApi } from "@/data/MemberApi";
import { Button, Container, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { useState } from "react";
import * as Yup from "yup";
import ReactSwal from "@/helper/AlertHelper";
import { useRouter } from "@/i18n/navigation";
import { sendButtonClick } from "@/helper/GAHelper";

export default function SendForgotPasswordEmail() {
  const t = useTranslations();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const schema = Yup.object().shape({
    email: Yup.string()
      .required(t("members.validation.required"))
      .email(t("members.validation.invalid")),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validateOnMount: true,
    validationSchema: schema,
  });

  const handleSubmit = async () => {
    try {
      formik.setTouched({
        email: true,
      });

      await formik.validateForm();

      if (!formik.isValid) {
        return;
      }

      setIsLoading(true);

      const success = await MemberApi.sendForgotPasswordEmail(formik.values.email);

      // clear form
      formik.resetForm();

      if (success) {
        sendButtonClick("forgot_password_send");
        ReactSwal.fire({
          icon: "success",
          title: t("members.phone_verification.code_sent_success"),
          text: t("members.forgot_password.email_sent_success"),
        });
      } else {
        ReactSwal.fire({
          icon: "error",
          title: t("error.title"),
          text: t("members.forgot_password.email_sent_failed"),
        });
      }

      formik.resetForm();
    } catch (error) {
      console.log(error);
      ReactSwal.fire({
        icon: "error",
        title: "Error",
        html: t(error.message || "error.unknown"),
      });
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
        gap: 1,
        py: 4,
      }}
    >
      <ValidationTextField
        name="email"
        type={"text"}
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        title={t("members.forgot_password.email")}
        errorText={formik.errors.email}
        touched={formik.touched.email}
      />

      <Box my={2}>
        <Typography color="textSecondary">{t("members.forgot_password.instructions")}</Typography>
      </Box>
      <Button variant="contained" fullWidth onClick={handleSubmit} disabled={isLoading}>
        {t("members.forgot_password.send_button")}
      </Button>
      <Button variant="secondary" fullWidth disabled={isLoading} onClick={() => router.push("/")}>
        {t("members.register_success.back_to_home")}
      </Button>
    </Container>
  );
}
