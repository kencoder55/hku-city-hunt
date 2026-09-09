"use client";
import AppLayout from "@/components/common/AppLayout";
import { Box } from "@mui/system";
import { useRouter } from "@/i18n/navigation";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useTranslations } from "use-intl";
import ValidationTextField from "@/components/common/ValidationTextField";
import { Button, Container, Stack } from "@mui/material";
import { MemberApi } from "@/data/MemberApi";
import { useAppSelector } from "@/lib/hooks";
import ReactSwal from "@/helper/AlertHelper";
import AuthContainer from "@/components/common/AuthContainer";
import { deleteCookie } from "cookies-next/client";
import { getAuthCookieName } from "@/helper/GlobalValueHelper";
import { sendButtonClick } from "@/helper/GAHelper";

export const createSchema = t => {
  return Yup.object().shape({
    password: Yup.string()
      .required(t("members.validation.password_required"))
      .min(8, t("members.validation.password_min_length"))
      .matches(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, t("members.validation.password_format")),
    confirmPassword: Yup.string()
      .required(t("members.validation.confirm_password_required"))
      .oneOf([Yup.ref("password")], t("members.validation.password_mismatch")),
  });
};

export default function ResetPassword() {
  const router = useRouter();
  const t = useTranslations();
  const schema = createSchema(t);
  const user = useAppSelector(state => state.user);
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validateOnMount: true,
    validationSchema: schema,
  });

  const handleSubmit = async () => {
    console.log("Submitting new password...", user);
    try {
      formik.setTouched({
        password: true,
        confirmPassword: true,
      });

      await formik.validateForm();

      if (!formik.isValid) {
        return;
      }

      // Submit new password logic here

      const success = await MemberApi.update(user.id, { password: formik.values.password });

      if (success) {
        sendButtonClick("password_reset");
        ReactSwal.fire({
          icon: "success",
          title: t("members.change_password.success_title"),
          text: t("members.change_password.success_message"),
        }).then(() => {
          deleteCookie(getAuthCookieName());
          router.push("/members/login");
        });
      } else {
        ReactSwal.fire({
          icon: "error",
          title: t("error.title"),
          text: t("members.change_password.failed_message"),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContainer>
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
          name={"password"}
          type={"password"}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          title={t("members.change_password.password")}
          errorText={formik.errors.password}
          touched={formik.touched.password}
        />

        <ValidationTextField
          name={"confirmPassword"}
          type={"password"}
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          title={t("members.change_password.confirm_password")}
          errorText={formik.errors.confirmPassword}
          touched={formik.touched.confirmPassword}
        />

        <Stack spacing={1} pt={4}>
          <Button
            variant="contained"
            fullWidth
            disabled={!formik.isValid || formik.isSubmitting}
            onClick={handleSubmit}
          >
            {t("members.change_password.change_button")}
          </Button>
          <Button variant="contained" fullWidth onClick={() => router.back()}>
            {t("members.register.back_button")}
          </Button>
        </Stack>
      </Container>
    </AuthContainer>
  );
}
