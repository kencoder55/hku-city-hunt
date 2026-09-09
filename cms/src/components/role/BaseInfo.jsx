import DebugLogger from "@/components/common/DebugLogger";
import UpdaterInfo from "@/components/common/UpdaterInfo";
import ValidationTextField from "@/components/common/ValidationTextField";
import { PermissionModuleApi } from "@/data/PermissionModuleApi";
import ReactSwal from "@/helper/AlertHelper";
import { getPermissionModulePageName } from "@/helper/GlobalValueHelper";
import { checkPermission } from "@/helper/PermissionHelper";
import { useAppSelector } from "@/lib/hooks";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function BaseInfo({ formik, onDelete, permissionConfig = {} }) {
  const t = useTranslations();
  const router = useRouter();
  const [haveCreatePermissionModulePermission, setHaveCreatePermissionModulePermission] =
    useState(false);
  const [haveDeletePermissionModulePermission, setHaveDeletePermissionModulePermission] =
    useState(false);
  const [haveDeletePermission, setHaveDeletePermission] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const currentUser = useAppSelector(state => state.user);
  const currentPage = useAppSelector(state => state.common.page);
  const isAdmin = formik.values.type === "admin";

  useEffect(() => {
    const deletePermission = checkPermission(currentUser, currentPage, "delete");
    setHaveDeletePermission(deletePermission);

    const createPermissionModulePermission = checkPermission(
      currentUser,
      getPermissionModulePageName(),
      "create",
    );
    setHaveCreatePermissionModulePermission(createPermissionModulePermission);

    const deletePermissionModulePermission = checkPermission(
      currentUser,
      getPermissionModulePageName(),
      "create",
    );
    setHaveDeletePermissionModulePermission(deletePermissionModulePermission);
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

  const showDeletePermissionModuleConfirm = module => {
    // stop default event
    return event => {
      event.preventDefault();
      ReactSwal.fire({
        title: t("error.warning"),
        text: t("error.delete_confirm"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: t("layout.ok"),
        cancelButtonText: t("layout.cancel"),
      }).then(result => {
        if (result.isConfirmed) {
          onDeletePermissionModule(module);
        }
      });
    };
  };

  const onDeletePermissionModule = async module => {
    if (!module) {
      toast.error(t("layout.deleted_failed"));
    }

    try {
      const success = await PermissionModuleApi.deleteByModule(module);
      if (success) {
        toast.success(t("layout.deleted_successfully"));
        // reload page
        router.reload();
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
  };

  const handlePermissionChange = (event, item, key) => {
    formik.setFieldValue("permission", {
      ...formik.values.permission,
      [key]: event.target.checked
        ? formik.values.permission?.[key]
          ? [...formik.values.permission?.[key], item]
          : [item]
        : formik.values.permission?.[key]?.filter(permission => permission !== item),
    });
  };

  const onCreatePermissionModule = () => {
    router.push(`/permission-modules/create?roleId=${formik.values.id}`);
  };

  return (
    <Card variant="outlined" sx={{ mb: 5 }}>
      <CardHeader
        title={t("role.role_information")}
        subheader={<Typography variant="caption">{t("role.manage_role")}</Typography>}
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
                <MenuItem disabled={!haveDeletePermission || isAdmin} onClick={showDeleteConfirm}>
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
          <DebugLogger title={"Role"} data={formik.values} hidden={true} />

          <ValidationTextField
            name={"name"}
            type={"text"}
            required
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            title={t("role.name")}
            errorText={formik.errors.name}
            touched={formik.touched.name}
            disabled={formik.values.type === "admin" && !!formik.values.id}
          />

          <Box border={1} borderColor="grey.400" borderRadius={1} p={2}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="left" variant="h6">
                      <Typography variant="h6">{t("permission.permission_setting")}</Typography>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell align="right">
                      {/* {haveCreatePermissionModulePermission && (
                        <Button
                          color="inherit"
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={onCreatePermissionModule}
                        >
                          {t("permission.new_permission_module")}
                        </Button>
                      )} */}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(permissionConfig).map(key => (
                    <TableRow key={key}>
                      <TableCell>
                        <Typography variant="h7">{t(`permission.${key}`)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {permissionConfig[key] &&
                            permissionConfig[key].map((item, index) => (
                              <Box key={item} ml={index !== 0 ? 2 : 0}>
                                <FormControlLabel
                                  onChange={event => handlePermissionChange(event, item, key)}
                                  checked={formik.values.permission?.[key]?.includes(item) || false}
                                  control={<Checkbox disabled={formik.values.type === "admin"} />}
                                  label={t(`permission.${item}`)}
                                />
                              </Box>
                            ))}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        {/* {haveDeletePermissionModulePermission && (
                          <Button variant="contained" color="error" onClick={showDeletePermissionModuleConfirm(key)}>
                            {t("layout.delete")}
                          </Button>
                        )} */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <UpdaterInfo data={formik.values} />
        </Stack>
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between", px: 2 }}></CardActions>
    </Card>
  );
}
