"use client";

import ActionFooter from "@/components/common/ActionFooter";
import DetailsSkeleton from "@/components/common/DetailsSkeleton";
import FullScreenLoading from "@/components/common/FullScreenLoading";
import PermissionChecker from "@/components/common/PermissionChecker";
import BaseInfo from "@/components/mission/BaseInfo";
import { MissionApi } from "@/data/MissionApi";
import ReactSwal from "@/helper/AlertHelper";
import { Breadcrumbs, Container, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
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

export default function Edit() {
  const t = useTranslations();
  const params = useParams();
  const { id } = params;
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
      const response = await MissionApi.details(id);

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

      const success = await MissionApi.update(id, input);
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
    ReactSwal.fire({
      title: t("error.warning"),
      text: t("error.delete_confirm"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("layout.ok"),
      cancelButtonText: t("layout.cancel"),
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          const success = await MissionApi.deleteData(id);
          if (success) {
            toast.success(t("layout.deleted_successfully"));
            router.back();
          } else {
            toast.error(t("layout.deleted_failed"));
          }
        } catch (error) {
          console.log(error);
          ReactSwal.fire({
            icon: "error",
            html: error.message,
          });
        }
      }
    });
  };

  return (
    <PermissionChecker page={"mission"} action={"update"}>
      <Container maxWidth="false">
        <FullScreenLoading open={fullScreenLoading} />
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
          <Link href={"/missions"}>
            <Typography color="text.primary">{t("menu.missions")}</Typography>
          </Link>
          <Typography color="text.primary">{t("layout.edit")}</Typography>
        </Breadcrumbs>

        {isLoading ? <DetailsSkeleton /> : <BaseInfo formik={formik} onDelete={onDelete} />}

        <ActionFooter onCancel={onCancel} onSubmit={update} />
      </Container>
    </PermissionChecker>
  );
}
