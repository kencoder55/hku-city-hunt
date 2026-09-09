"use client";
import ValidationTextField from "@/components/common/ValidationTextField";
import { MemberApi } from "@/data/MemberApi";
import ReactSwal from "@/helper/AlertHelper";
import { useRouter } from "@/i18n/navigation";
import { Button, Container } from "@mui/material";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";
import { sendButtonClick } from "@/helper/GAHelper";

export default function ChangePassword() {
  const t = useTranslations();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // get search param token, use nextjs useSearchParams
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const resetPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .required(t("members.validation.password_required"))
      .min(8, t("members.validation.password_min_length"))
      .matches(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, t("members.validation.password_format")),
    confirmPassword: Yup.string()
      .required(t("members.validation.confirm_password_required"))
      .oneOf([Yup.ref("password")], t("members.validation.password_mismatch")),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validateOnMount: true,
    validationSchema: resetPasswordSchema,
  });

  const changePassword = async () => {
    try {
      formik.setTouched({
        password: true,
        confirmPassword: true,
      });

      if (!formik.isValid) {
        return;
      }

      setIsLoading(true);

      const success = await MemberApi.changePassword(token, formik.values.password);

      if (success) {
        sendButtonClick("password_changed");
        await ReactSwal.fire({
          icon: "success",
          title: t("members.change_password.success_title"),
          text: t("members.change_password.success_message"),
        }).then(() => {
          router.push("/members/login");
        });
      } else {
        await ReactSwal.fire({
          icon: "error",
          title: t("error.title"),
          text: t("members.change_password.failed_message"),
        });
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      ReactSwal.fire({
        icon: "error",
        title: "Error",
        text: t(error?.message || "error.unknown"),
      });
    } finally {
      formik.resetForm();
      setIsLoading(false);
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        py: 4,
      }}
    >
      <ValidationTextField
        name="password"
        type="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        title={t("members.change_password.password")}
        errorText={formik.errors.password}
        touched={formik.touched.password}
        required
      />

      <ValidationTextField
        name="confirmPassword"
        type="password"
        value={formik.values.confirmPassword}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        title={t("members.change_password.confirm_password")}
        errorText={formik.errors.confirmPassword}
        touched={formik.touched.confirmPassword}
        required
      />

      <Button variant="contained" color="primary" onClick={changePassword} disabled={isLoading}>
        {isLoading
          ? t("members.change_password.changing")
          : t("members.change_password.change_button")}
      </Button>
    </Container>
  );
}
