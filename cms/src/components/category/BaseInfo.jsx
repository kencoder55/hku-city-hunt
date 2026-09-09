import DebugLogger from "@/components/common/DebugLogger";
import UpdaterInfo from "@/components/common/UpdaterInfo";
import ValidationTextField from "@/components/common/ValidationTextField";
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

export default function BaseInfo({ formik, onDelete }) {
  const t = useTranslations();
  const [haveDeletePermission, setHaveDeletePermission] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const currentUser = useAppSelector(state => state.user);
  const currentPage = useAppSelector(state => state.common.page);

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

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 5,
      }}
    >
      <CardHeader
        title={t("categories.category_information")}
        subheader={<Typography variant="caption">{t("categories.manage_category")}</Typography>}
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
          <DebugLogger title={"Category"} data={formik.values} hidden={true} />

          <ValidationTextField
            name={"nameZh"}
            type={"text"}
            required
            value={formik.values.nameZh || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            title={t("categories.name_zh")}
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
            title={t("categories.name_en")}
            errorText={formik.errors.nameEn}
            touched={formik.touched.nameEn}
          />

          <UpdaterInfo data={formik.values} />
        </Stack>
      </CardContent>
    </Card>
  );
}
