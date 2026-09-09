"use client";

import ActionFooter from "@/components/common/ActionFooter";
import FullScreenLoading from "@/components/common/FullScreenLoading";
import PermissionChecker from "@/components/common/PermissionChecker";
import BaseInfo from "@/components/member/BaseInfo";
import { MemberApi } from "@/data/MemberApi";
import ReactSwal from "@/helper/AlertHelper";
import { getMemberPageName } from "@/helper/GlobalValueHelper";
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
    avatarId: Yup.number().required(t("error.required")).min(1).max(5),
    name: Yup.string().required(t("error.name_is_required")),
    email: Yup.string().required(t("error.name_is_required")).email(t("error.email_is_invalid")),
    phone: Yup.string()
      .required(t("error.phone_number_is_required"))
      .matches(/^[0-9]+$/, t("error.phone_is_invalid")),
    password: Yup.string()
      .required(t("error.password_is_required"))
      .min(8, t("error.password_min_length"))
      .matches(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, {
        excludeEmptyString: false,
        message: t("error.password_warning"),
      }),
    gender: Yup.string().required(t("error.gender_is_required")),
    age: Yup.string()
      .required(t("error.age_is_required"))
      .oneOf(["<20", "20-34", "35-54", ">=55"], t("error.age_range")),
  });
};

export default function Create() {
  const t = useTranslations();
  const router = useRouter();
  const validationSchema = createSchema(t);
  const formik = useFormik({
    initialValues: {
      avatarId: 1,
      name: "",
      email: "",
      gender: "",
      age: "",
      phone: "",
      password: "",
      isSmsVerified: true,
    },
    validateOnMount: true,
    validationSchema: validationSchema,
  });
  const [fullScreenLoading, setFullScreenLoading] = useState(false);

  const onSubmit = async () => {
    formik.setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
    });

    formik.validateForm();

    if (!formik.isValid) {
      return;
    }

    const input = {
      ...formik.values,
    };

    try {
      setFullScreenLoading(true);

      const id = await MemberApi.create(input);

      if (id) {
        toast.success(t("layout.created_successfully"));
        router.push(`/members`);
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
    <PermissionChecker page={getMemberPageName()} action={"create"}>
      <Container maxWidth="false">
        <FullScreenLoading open={fullScreenLoading} />
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
          <Link href={"/members"}>{t("menu.members")}</Link>
          <Typography color="text.primary">{t("layout.create")}</Typography>
        </Breadcrumbs>
        <BaseInfo formik={formik} />
        <ActionFooter onSubmit={onSubmit} onCancel={onCancel} />
      </Container>
    </PermissionChecker>
  );
}
