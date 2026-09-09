"use client";

import ActionFooter from "@/components/common/ActionFooter";
import FullScreenLoading from "@/components/common/FullScreenLoading";
import PermissionChecker from "@/components/common/PermissionChecker";
import BaseInfo from "@/components/mission/BaseInfo";
import { MissionApi } from "@/data/MissionApi";
import ReactSwal from "@/helper/AlertHelper";
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
    slug: Yup.string().required(t("error.slug_is_required")),
    nameZh: Yup.string().required(t("error.name_is_required")),
    nameEn: Yup.string(),
    type: Yup.string(),
    descriptionZh: Yup.string(),
    descriptionEn: Yup.string(),
    category: Yup.string(),
    startTime: Yup.string().required(t("error.start_time_is_required")),
    endTime: Yup.string().required(t("error.end_time_is_required")),
    location: Yup.mixed(),
    parameter: Yup.mixed(),
  });
};

export default function Create() {
  const t = useTranslations();
  const router = useRouter();
  const validationSchema = createSchema(t);
  const formik = useFormik({
    initialValues: {
      slug: "",
      nameZh: "",
      nameEn: "",
      type: "",
      descriptionZh: "",
      descriptionEn: "",
      category: "",
      startTime: "",
      endTime: "",
      location: [],
      parameter: {},
    },
    validateOnMount: true,
    validationSchema: validationSchema,
  });
  const [fullScreenLoading, setFullScreenLoading] = useState(false);

  const onSubmit = async () => {
    formik.setTouched({
      slug: true,
      nameZh: true,
      startTime: true,
      endTime: true,
    });

    await formik.validateForm();

    if (!formik.isValid) {
      return;
    }

    const input = {
      ...formik.values,
    };

    try {
      setFullScreenLoading(true);

      const result = await MissionApi.create(input);

      if (result) {
        toast.success(t("layout.created_successfully"));
        router.push(`/missions`);
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
    <PermissionChecker page={"mission"} action={"create"}>
      <Container maxWidth="false">
        <FullScreenLoading open={fullScreenLoading} />
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
          <Link href={"/missions"}>
            <Typography color="text.primary">{t("menu.missions")}</Typography>
          </Link>
          <Typography color="text.primary">{t("layout.create")}</Typography>
        </Breadcrumbs>

        <BaseInfo formik={formik} />

        <ActionFooter onCancel={onCancel} onSubmit={onSubmit} />
      </Container>
    </PermissionChecker>
  );
}
