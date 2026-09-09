"use client";

import ActionFooter from "@/components/common/ActionFooter";
import FullScreenLoading from "@/components/common/FullScreenLoading";
import PermissionChecker from "@/components/common/PermissionChecker";
import BaseInfo from "@/components/redemption-code/BaseInfo";
import { RedemptionCodeApi } from "@/data/RedemptionCodeApi";
import ReactSwal from "@/helper/AlertHelper";
import { getRedemptionCodePageName } from "@/helper/GlobalValueHelper";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { Breadcrumbs, Container, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

export const createSchema = t => {
  return Yup.object().shape({
    type: Yup.string().required(t("error.required")),
    code: Yup.string().required(t("error.required")),
    isUsed: Yup.boolean(),
  });
};

export default function Create() {
  const t = useTranslations();
  const router = useRouter();
  const validationSchema = createSchema(t);
  const formik = useFormik({
    initialValues: {
      type: "",
      code: "",
      isUsed: false,
    },
    validateOnMount: true,
    validationSchema: validationSchema,
  });
  const [fullScreenLoading, setFullScreenLoading] = useState(false);

  const onSubmit = async () => {
    formik.setTouched({
      type: true,
      code: true,
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

      const result = await RedemptionCodeApi.create(input);

      if (result) {
        toast.success(t("layout.created_successfully"));
        router.push(`/redemption-codes`);
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
    <PermissionChecker page={getRedemptionCodePageName()} action={"create"}>
      <Container maxWidth="false">
        <FullScreenLoading open={fullScreenLoading} />
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
          <Link href={"/redemption-codes"}>{t("menu.redemption_codes")}</Link>
          <Typography color="text.primary">{t("layout.create")}</Typography>
        </Breadcrumbs>
        <BaseInfo formik={formik} />
        <ActionFooter onSubmit={onSubmit} onCancel={onCancel} />
      </Container>
    </PermissionChecker>
  );
}
