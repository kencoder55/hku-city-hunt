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
        title={t("contact.contact_information")}
        subheader={<Typography variant="caption">{t("contact.manage_contact")}</Typography>}
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
          <DebugLogger title={"Contact"} data={formik.values} hidden={true} />

          <ValidationTextField
            name={"name"}
            type={"text"}
            required
            value={formik.values.name || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            title={t("categories.name")}
            errorText={formik.errors.name}
            touched={formik.touched.name}
          />

          <ValidationTextField
            name={"email"}
            type={"text"}
            required
            value={formik.values.email || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            title={t("contact.email")}
            errorText={formik.errors.email}
            touched={formik.touched.email}
          />

          <ValidationTextField
            name={"phone"}
            type={"text"}
            required
            value={formik.values.phone || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            title={t("contact.phone")}
            errorText={formik.errors.phone}
            touched={formik.touched.phone}
          />

          <ValidationTextField
            name={"purpose"}
            type={"text"}
            value={formik.values.purpose || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            title={t("contact.purpose")}
            errorText={formik.errors.purpose}
            touched={formik.touched.purpose}
          />

          <ValidationTextField
            name={"message"}
            type={"text"}
            multiline={true}
            rows={4}
            value={formik.values.message || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            title={t("contact.message")}
            errorText={formik.errors.message}
            touched={formik.touched.message}
          />

          <UpdaterInfo data={formik.values} />
        </Stack>
      </CardContent>
    </Card>
  );
}
