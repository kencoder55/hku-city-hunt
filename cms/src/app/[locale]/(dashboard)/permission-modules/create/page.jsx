"use client";

import ActionFooter from "@/components/common/ActionFooter";
import FullScreenLoading from "@/components/common/FullScreenLoading";
import PermissionChecker from "@/components/common/PermissionChecker";
import BaseInfo from "@/components/permission-module/BaseInfo";
import { PermissionModuleApi } from "@/data/PermissionModuleApi";
import ReactSwal from "@/helper/AlertHelper";
import { getPermissionModulePageName } from "@/helper/GlobalValueHelper";
import { Breadcrumbs, Container, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

export const createSchema = t => {
  return Yup.object().shape({
    module: Yup.string().required(t("error.module_is_required")),
    actions: Yup.array().min(1, t("error.actions_are_required")),
  });
};

export default function Create() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const roleId = searchParams.get("roleId");
  const router = useRouter();
  const validationSchema = createSchema(t);
  const formik = useFormik({
    initialValues: {
      module: "",
      actions: [],
    },
    validateOnMount: true,
    validationSchema: validationSchema,
  });
  const [fullScreenLoading, setFullScreenLoading] = useState(false);

  const onSubmit = async () => {
    formik.setTouched({
      module: true,
      actions: true,
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

      const id = await PermissionModuleApi.create(input);

      if (id) {
        toast.success(t("layout.created_successfully"));
        router.push(`/roles/${roleId}`);
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
    <PermissionChecker page={getPermissionModulePageName()} action={"create"}>
      <Container maxWidth="false">
        <FullScreenLoading open={fullScreenLoading} />
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
          <Link href={"/settings"}>{t("menu.settings")}</Link>
          <Link href={"/roles"}>{t("menu.roles")}</Link>
          <Link href={`/roles/${roleId}`}>{t("permission.permission_setting")}</Link>
          <Typography color="text.primary">{t("layout.create")}</Typography>
        </Breadcrumbs>
        <BaseInfo formik={formik} />
        <ActionFooter onSubmit={onSubmit} onCancel={onCancel} />
      </Container>
    </PermissionChecker>
  );
}
