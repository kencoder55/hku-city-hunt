"use client";

import ActionFooter from "@/components/common/ActionFooter";
import FullScreenLoading from "@/components/common/FullScreenLoading";
import PermissionChecker from "@/components/common/PermissionChecker";
import BaseInfo from "@/components/role/BaseInfo";
import { PermissionApi } from "@/data/PermissionApi";
import { PermissionModuleApi } from "@/data/PermissionModuleApi";
import { RoleApi } from "@/data/RoleApi";
import ReactSwal from "@/helper/AlertHelper";
import { getRolePageName } from "@/helper/GlobalValueHelper";
import { Breadcrumbs, Container, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

export const createSchema = t => {
  return Yup.object().shape({
    name: Yup.string().required(t("error.name_is_required")),
  });
};

export default function Create() {
  const t = useTranslations();
  const router = useRouter();
  const validationSchema = createSchema(t);
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validateOnMount: true,
    validationSchema: validationSchema,
  });
  const [fullScreenLoading, setFullScreenLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [optionsPage, setOptionsPage] = useState(1);
  const [optionsPageSize, setOptionsPageSize] = useState(-1);
  const [optionsFilters, setOptionsFilters] = useState([]);

  useEffect(() => {
    fetchOptionsData();
  }, []);

  const fetchOptionsData = async () => {
    try {
      setFullScreenLoading(true);
      const response = await PermissionModuleApi.list(optionsPage, optionsPageSize, optionsFilters);
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

  const getPermission = () => {
    let permission = {};
    options.forEach(item => {
      permission[item.module] = item.actions;
    });
    return permission;
  };

  const onSubmit = async () => {
    formik.setTouched({
      name: true,
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

      const id = await RoleApi.create(input);

      if (id) {
        const saveSuccess = await PermissionApi.save(id, input.permission);

        if (saveSuccess) {
          toast.success(t("layout.created_successfully"));
          router.push(`/roles`);
        } else {
          toast.error(t("layout.create_failed"));
        }
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
    <PermissionChecker page={getRolePageName()} action={"create"}>
      <Container maxWidth="false">
        <FullScreenLoading open={fullScreenLoading} />
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
          <Link href={"/roles"}>{t("menu.roles")}</Link>
          <Typography color="text.primary">{t("layout.create")}</Typography>
        </Breadcrumbs>
        <BaseInfo formik={formik} permissionConfig={getPermission()} />
        <ActionFooter onSubmit={onSubmit} onCancel={onCancel} />
      </Container>
    </PermissionChecker>
  );
}
