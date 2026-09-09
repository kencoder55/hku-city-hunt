"use client";

import ActionFooter from "@/components/common/ActionFooter";
import FullScreenLoading from "@/components/common/FullScreenLoading";
import PermissionChecker from "@/components/common/PermissionChecker";
import BaseInfo from "@/components/user/BaseInfo";
import { UserApi } from "@/data/UserApi";
import ReactSwal from "@/helper/AlertHelper";
import { getUserPageName } from "@/helper/GlobalValueHelper";
import { Breadcrumbs, Container, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

export const createSchema = t => {
  return Yup.object().shape({
    username: Yup.string().required(t("error.username_is_required")),
    email: Yup.string().required(t("error.email_is_required")).email(t("error.email_is_invalid")),
    password: Yup.string()
      .required(t("error.password_is_required"))
      .min(8, t("error.password_min_length"))
      .matches(/((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/, {
        excludeEmptyString: false,
        message: t("error.password_warning"),
      }),
  });
};

export default function Create() {
  const t = useTranslations();
  const router = useRouter();
  const validationSchema = createSchema(t);
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      roles: [],
    },
    validateOnMount: true,
    validationSchema: validationSchema,
  });
  const [fullScreenLoading, setFullScreenLoading] = useState(false);

  const validateForm = () => {
    let hasError = false;

    if (formik.values.roles.length == 0 || !formik.values.roles) {
      toast.error(t("error.please_select_role"));
      hasError = true;
    }

    return hasError;
  };

  const onSubmit = async () => {
    formik.setTouched({
      username: true,
      password: true,
    });

    formik.validateForm();

    if (!formik.isValid) {
      return;
    }

    let error = validateForm();

    if (error) {
      return;
    }

    const input = {
      ...formik.values,
    };

    try {
      setFullScreenLoading(true);

      const id = await UserApi.create(input);

      if (id) {
        toast.success(t("layout.created_successfully"));
        router.push(`/users`);
      } else {
        toast.error(t("layout.created_failed"));
      }
    } catch (error) {
      console.log(error);
      ReactSwal.fire({
        icon: "error",
        html: error.message,
      });
    } finally {
      setFullScreenLoading(false);
    }
  };

  const onCancel = () => {
    router.back();
  };

  return (
    <PermissionChecker page={getUserPageName()} action={"create"}>
      <Container maxWidth="false">
        <FullScreenLoading open={fullScreenLoading} />
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
          <Link href={"/settings"}>{t("menu.settings")}</Link>
          <Link href={"/users"}>{t("menu.users")}</Link>
          <Typography color="text.primary">{t("layout.create")}</Typography>
        </Breadcrumbs>
        <BaseInfo formik={formik} />
        <ActionFooter onSubmit={onSubmit} onCancel={onCancel} />
      </Container>
    </PermissionChecker>
  );
}
