"use client";

import ActionFooter from "@/components/common/ActionFooter";
import DetailsSkeleton from "@/components/common/DetailsSkeleton";
import FullScreenLoading from "@/components/common/FullScreenLoading";
import PermissionChecker from "@/components/common/PermissionChecker";
import BaseInfo from "@/components/member/BaseInfo";
import { MemberApi } from "@/data/MemberApi";
import ReactSwal from "@/helper/AlertHelper";
import { getMemberPageName } from "@/helper/GlobalValueHelper";
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
    avatarId: Yup.number().required(t("error.required")).min(1).max(5),
    name: Yup.string().required(t("error.name_is_required")),
    email: Yup.string().required(t("error.name_is_required")).email(t("error.email_is_invalid")),
    phone: Yup.string()
      .required(t("error.phone_number_is_required"))
      .matches(/^[0-9]+$/, t("error.phone_is_invalid")),
    password: Yup.string()
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

export default function Edit() {
  const t = useTranslations();
  const params = useParams();
  const { id } = params;
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
      isSmsVerified: false,
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
      const response = await MemberApi.details(id);

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
      name: true,
      email: true,
      phone: true,
      password: true,
      age: true,
      avatarId: true,
      gender: true,
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

      const success = await MemberApi.update(id, input);
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
      const success = await MemberApi.deleteData(id);
      if (success) {
        toast.success(t("layout.deleted_successfully"));
        router.push(`/members`);
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
    <PermissionChecker page={getMemberPageName()} action={"update"}>
      <Container maxWidth="false">
        <FullScreenLoading open={fullScreenLoading} />
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
          <Link href={"/members"}>{t("menu.members")}</Link>
          <Typography color="text.primary">{t("layout.edit")}</Typography>
        </Breadcrumbs>
        <BaseInfo formik={formik} onDelete={onDelete} />
        <ActionFooter onSubmit={update} onCancel={onCancel} />
      </Container>
    </PermissionChecker>
  );
}
