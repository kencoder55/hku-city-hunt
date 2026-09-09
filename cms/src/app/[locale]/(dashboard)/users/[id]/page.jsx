"use client";

import ActionFooter from "@/components/common/ActionFooter";
import DetailsSkeleton from "@/components/common/DetailsSkeleton";
import FullScreenLoading from "@/components/common/FullScreenLoading";
import PermissionChecker from "@/components/common/PermissionChecker";
import BaseInfo from "@/components/user/BaseInfo";
import { RoleApi } from "@/data/RoleApi";
import { UserApi } from "@/data/UserApi";
import ReactSwal from "@/helper/AlertHelper";
import { getUserPageName } from "@/helper/GlobalValueHelper";
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
    username: Yup.string().required(t("error.username_is_required")),
    email: Yup.string().required(t("error.email_is_required")).email(t("error.email_is_invalid")),
    password: Yup.string()
      .min(8, t("error.password_min_length"))
      .matches(/((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/, {
        excludeEmptyString: false,
        message: t("error.password_warning"),
      }),
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
      username: "",
      email: "",
      password: "",
      roles: [],
    },
    validateOnMount: true,
    validationSchema: validationSchema,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [fullScreenLoading, setFullScreenLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [optionsPage, setOptionsPage] = useState(1);
  const [optionsPageSize, setOptionsPageSize] = useState(-1);
  const [optionsFilters, setOptionsFilters] = useState([]);

  useEffect(() => {
    fetchRoleData();
  }, []);

  const fetchRoleData = async () => {
    try {
      setFullScreenLoading(true);
      const response = await RoleApi.list(optionsPage, optionsPageSize, optionsFilters);
      setOptions(response.data);
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

  useEffect(() => {
    if (!id) {
      router.back();
      return;
    }

    if (options?.length == 0) {
      return;
    }

    fetchData();
  }, [options]);

  const fetchData = async () => {
    try {
      const response = await UserApi.details(id);
      response.roles = response.roles.map(role => {
        return {
          label: role.name,
          value: role.id,
        };
      });

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

  const validateForm = () => {
    let hasError = false;

    if (formik.values.roles.length == 0 || !formik.values.roles) {
      toast.error(t("error.please_select_role"));
      hasError = true;
    }

    return hasError;
  };

  const update = async () => {
    formik.setTouched({
      username: true,
      password: true,
    });

    formik.validateForm();

    if (!formik.isValid) {
      return;
    }

    const error = validateForm();

    if (error) {
      return;
    }

    const input = {
      ...formik.values,
    };
    try {
      setFullScreenLoading(true);

      const success = await UserApi.update(id, input);
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
      const success = await UserApi.deleteData(id);
      if (success) {
        toast.success(t("layout.deleted_successfully"));
        router.push(`/users`);
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
    <PermissionChecker page={getUserPageName()} action={"update"}>
      <Container maxWidth="false">
        <FullScreenLoading open={fullScreenLoading} />
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
          <Link href={"/settings"}>{t("menu.settings")}</Link>
          <Link href={"/users"}>{t("menu.users")}</Link>
          <Typography color="text.primary">{t("layout.edit")}</Typography>
        </Breadcrumbs>
        <BaseInfo formik={formik} onDelete={onDelete} />
        <ActionFooter onSubmit={update} onCancel={onCancel} />
      </Container>
    </PermissionChecker>
  );
}
