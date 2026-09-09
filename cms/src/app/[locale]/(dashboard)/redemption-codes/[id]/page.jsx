"use client";

import ActionFooter from "@/components/common/ActionFooter";
import DetailsSkeleton from "@/components/common/DetailsSkeleton";
import FullScreenLoading from "@/components/common/FullScreenLoading";
import PermissionChecker from "@/components/common/PermissionChecker";
import BaseInfo from "@/components/redemption-code/BaseInfo";
import { RedemptionCodeApi } from "@/data/RedemptionCodeApi";
import ReactSwal from "@/helper/AlertHelper";
import { getRedemptionCodePageName } from "@/helper/GlobalValueHelper";
import { Link, useRouter } from "@/i18n/navigation";
import { Breadcrumbs, Container, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

export const createSchema = t => {
  return Yup.object().shape({
    type: Yup.string().required(t("error.required")),
    code: Yup.string().required(t("error.required")),
    isUsed: Yup.boolean(),
  });
};

export default function Edit() {
  const t = useTranslations();
  const params = useParams();
  const { id } = params;
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
  const [isLoading, setIsLoading] = useState(true);
  const [fullScreenLoading, setFullScreenLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      router.back();
      return;
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await RedemptionCodeApi.details(id);

      formik.setValues(response);
    } catch (error) {
      console.log(error);
      ReactSwal.fire({
        icon: "error",
        html: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const update = async () => {
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

      const success = await RedemptionCodeApi.update(id, input);
      if (success) {
        toast.success(t("layout.updated_successfully"));
        fetchData();
      } else {
        toast.error(t("layout.updated_failed"));
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

  const onDelete = async () => {
    try {
      setFullScreenLoading(true);
      const success = await RedemptionCodeApi.deleteData(id);
      if (success) {
        toast.success(t("layout.deleted_successfully"));
        router.push(`/redemption-codes`);
      } else {
        toast.error(t("layout.deleted_failed"));
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

  if (isLoading) {
    return <DetailsSkeleton />;
  }

  return (
    <PermissionChecker page={getRedemptionCodePageName()} action={"update"}>
      <Container maxWidth="false">
        <FullScreenLoading open={fullScreenLoading} />
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
          <Link href={"/redemption-codes"}>{t("menu.redemption_codes")}</Link>
          <Typography color="text.primary">{t("layout.edit")}</Typography>
        </Breadcrumbs>
        <BaseInfo id={id} formik={formik} onDelete={onDelete} />
        <ActionFooter onSubmit={update} onCancel={onCancel} />
      </Container>
    </PermissionChecker>
  );
}
