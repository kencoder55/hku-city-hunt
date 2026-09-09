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
import { Link, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

export const createSchema = t => {
  return Yup.object().shape({
    name: Yup.string().required(t("error.name_is_required")),
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
      name: "",
      type: "user",
      permission: {},
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
    if (!id) {
      router.back();
      return;
    }

    fetchData();
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

  const fetchData = async () => {
    try {
      setFullScreenLoading(true);
      const response = await RoleApi.details(id);
      if (response) {
        formik.setValues(response);

        let permission = getPermission();
        let permissionResult = await PermissionApi.details(id);
        for (const [key, value] of Object.entries(permissionResult)) {
          permission[key] = value;
          if (value.length === 0) {
            permission[key] = [];
          }
        }

        formik.setFieldValue("permission", permission);
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

  const getPermission = () => {
    let permission = {};
    options.forEach(item => {
      permission[item.module] = item.actions;
    });
    return permission;
  };

  const update = async () => {
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

      const success = await RoleApi.update(id, input);
      if (success) {
        const saveSuccess = await PermissionApi.save(id, input.permission);

        if (saveSuccess) {
          toast.success(t("layout.updated_successfully"));
        } else {
          toast.error(t("layout.update_failed"));
        }
      } else {
        toast.error(t("layout.update_failed"));
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
      const success = await RoleApi.deleteData(id);
      if (success) {
        toast.success(t("layout.deleted_successfully"));
        router.push(`/roles`);
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

  return (
    <PermissionChecker page={getRolePageName()} action={"update"}>
      <Container maxWidth="false">
        <FullScreenLoading open={fullScreenLoading} />
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
          <Link href={"/settings"}>{t("menu.settings")}</Link>
          <Link href={"/roles"}>{t("menu.roles")}</Link>
          <Typography color="text.primary">{t("layout.edit")}</Typography>
        </Breadcrumbs>
        <BaseInfo formik={formik} onDelete={onDelete} permissionConfig={getPermission()} />
        <ActionFooter onSubmit={update} onCancel={onCancel} />
      </Container>
    </PermissionChecker>
  );
}
