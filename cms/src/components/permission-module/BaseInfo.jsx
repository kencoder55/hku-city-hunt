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
  Chip,
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
  const [fullScreenLoading, setFullScreenLoading] = useState(false);

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
      <FullScreenLoading open={fullScreenLoading} />
      <CardHeader
        title={t("permission.permissionModule")}
        subheader={
          <Typography variant="caption">{t("permission.manage_permission_module")}</Typography>
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
          <DebugLogger title="Permission Module" data={formik.values} hidden={true} />

          <ValidationTextField
            name={"module"}
            type={"text"}
            required={true}
            value={formik.values.module}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            title={t("permission.module")}
            errorText={formik.errors.module}
            touched={formik.touched.module}
          />

          <ValidationAutocomplete
            name={"actions"}
            required
            options={formik.values.actions.map(option => option)}
            value={formik.values.actions || []}
            onChange={(event, value) => {
              if (value !== formik.values.actions) {
                formik.setFieldValue("actions", value);
                if (value.length >= 1) {
                  formik.setFieldTouched("actions", false);
                } else {
                  formik.setFieldTouched("actions", true);
                }
              }
            }}
            onBlur={formik.handleBlur}
            title={t("permission.action")}
            errorText={formik.errors.actions}
            touched={formik.touched.actions}
            freeSolo={true}
            renderTags={(value, getTagProps) =>
              value &&
              value.map((option, index) => {
                const { key, ...otherProps } = getTagProps({ index });
                return <Chip key={key} variant="outlined" label={option} {...otherProps} />;
              })
            }
            placeholder={t("permission.please_enter_to_confirm_add_action")}
          />

          <UpdaterInfo data={formik.values} />
        </Stack>
      </CardContent>
    </Card>
  );
}
