import DebugLogger from "@/components/common/DebugLogger";
import UpdaterInfo from "@/components/common/UpdaterInfo";
import ValidationTextField from "@/components/common/ValidationTextField";
import { CategoryApi } from "@/data/CategoryApi";
import ReactSwal from "@/helper/AlertHelper";
import { checkPermission } from "@/helper/PermissionHelper";
import { useAppSelector } from "@/lib/hooks";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import FullScreenLoading from "../common/FullScreenLoading";
import ValidationAutocomplete from "../common/ValidationAutocomplete";

export default function BaseInfo({ formik, onDelete }) {
  const t = useTranslations();
  const [haveDeletePermission, setHaveDeletePermission] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const currentUser = useAppSelector(state => state.user);
  const currentPage = useAppSelector(state => state.common.page);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categoryOptionsPage, setCategoryOptionsPage] = useState(1);
  const [categoryOptionsPageSize, setCategoryOptionsPageSize] = useState(-1);
  const [categoryOptionsFilters, setCategoryOptionsFilters] = useState([]);
  const [fullScreenLoading, setFullScreenLoading] = useState(false);

  useEffect(() => {
    fetchCategoryOptionsData();
  }, []);

  useEffect(() => {
    const deletePermission = checkPermission(currentUser, currentPage, "delete");
    setHaveDeletePermission(deletePermission);
  }, [currentUser, currentPage]);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const showDeleteConfirm = () => {
    ReactSwal.fire({
      title: t("error.warning"),
      text: t("error.delete_confirm"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("layout.ok"),
      cancelButtonText: t("layout.cancel"),
    }).then(result => {
      if (result.isConfirmed) {
        onDelete();
      }
    });
  };

  const fetchCategoryOptionsData = async () => {
    try {
      setFullScreenLoading(true);
      const response = await CategoryApi.list(
        categoryOptionsPage,
        categoryOptionsPageSize,
        categoryOptionsFilters,
      );

      if (response.data) {
        console.log(response.data);
        setCategoryOptions(
          response.data.map(item => {
            return {
              id: item.id,
              name: item.nameZh,
            };
          }),
        );
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
    <Card
      variant="outlined"
      sx={{
        mb: 5,
      }}
    >
      <FullScreenLoading open={fullScreenLoading} />
      <CardHeader
        title={t("category_groups.category_group_information")}
        subheader={
          <Typography variant="caption">{t("category_groups.manage_category_group")}</Typography>
        }
        action={
          onDelete ? (
            <Box>
              <IconButton onClick={handleClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem disabled={!haveDeletePermission} onClick={showDeleteConfirm}>
                  <Typography color={"error"}>{t("layout.delete")}</Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box />
          )
        }
      />

      <CardContent>
        <Stack spacing={2}>
          <DebugLogger title={"Category Groups"} data={formik.values} hidden={true} />
          <DebugLogger title={"Category Options"} data={categoryOptions} hidden={true} />

          <ValidationTextField
            name={"nameZh"}
            type={"text"}
            required
            value={formik.values.nameZh || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            title={t("category_groups.name_zh")}
            errorText={formik.errors.nameZh}
            touched={formik.touched.nameZh}
          />

          <ValidationTextField
            name={"nameEn"}
            type={"text"}
            required
            value={formik.values.nameEn || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            title={t("category_groups.name_en")}
            errorText={formik.errors.nameEn}
            touched={formik.touched.nameEn}
          />

          <ValidationAutocomplete
            name={"categoryIds"}
            value={formik.values.categoryIds || []}
            onChange={(event, value) => {
              formik.setFieldValue("categoryIds", value);
              if (value.length >= 1) {
                formik.setFieldTouched("categoryIds", false);
              } else {
                formik.setFieldTouched("categoryIds", true);
              }
            }}
            onBlur={formik.handleBlur}
            title={t("category_groups.category")}
            errorText={formik.errors.categoryIds}
            touched={formik.touched.categoryIds}
            options={categoryOptions}
            disabled={!categoryOptions || categoryOptions.length === 0}
          />

          <UpdaterInfo data={formik.values} />
        </Stack>
      </CardContent>
    </Card>
  );
}
