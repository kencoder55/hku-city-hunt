"use client";

import ActionFooter from "@/components/common/ActionFooter";
import FullScreenLoading from "@/components/common/FullScreenLoading";
import PermissionChecker from "@/components/common/PermissionChecker";
import BaseInfo from "@/components/product/BaseInfo";
import { ProductApi } from "@/data/ProductApi";
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
    nameZh: Yup.string().required(t("error.name_is_required")),
    nameEn: Yup.string(),
    descriptionZh: Yup.string(),
    descriptionEn: Yup.string(),
    stock: Yup.number()
      .required(t("error.required"))
      .min(0, t("error.number_must_be_greater_than_zero")),
    requiredRewards: Yup.number()
      .required(t("error.required"))
      .min(0, t("error.number_must_be_greater_than_zero")),
  });
};

export default function Create() {
  const t = useTranslations();
  const router = useRouter();
  const validationSchema = createSchema(t);
  const formik = useFormik({
    initialValues: {
      coverImage: "",
      file: null,
      nameZh: "",
      nameEn: "",
      descriptionZh: "",
      descriptionEn: "",
      type: "product",
      stock: 0,
      requiredRewards: 0,
      redemptionDateZh: "",
      redemptionDateEn: "",
      redemptionLink: "",
    },
    validateOnMount: true,
    validationSchema: validationSchema,
  });
  const [fullScreenLoading, setFullScreenLoading] = useState(false);

  const onSubmit = async () => {
    formik.setTouched({
      nameZh: true,
      stock: true,
      requiredRewards: true,
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

      const result = await ProductApi.create(input);

      if (result) {
        toast.success(t("layout.created_successfully"));
        router.push(`/products`);
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
    <PermissionChecker page={"product"} action={"create"}>
      <Container maxWidth="false">
        <FullScreenLoading open={fullScreenLoading} />
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
          <Link href={"/products"}>{t("menu.products")}</Link>
          <Typography color="text.primary">{t("layout.create")}</Typography>
        </Breadcrumbs>
        <BaseInfo formik={formik} />
        <ActionFooter onSubmit={onSubmit} onCancel={onCancel} />
      </Container>
    </PermissionChecker>
  );
}
