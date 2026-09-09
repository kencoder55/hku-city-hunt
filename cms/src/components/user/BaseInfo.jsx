import DebugLogger from "@/components/common/DebugLogger";
import UpdaterInfo from "@/components/common/UpdaterInfo";
import ValidationTextField from "@/components/common/ValidationTextField";
import { RoleApi } from "@/data/RoleApi";
import ReactSwal from "@/helper/AlertHelper";
import { checkPermission } from "@/helper/PermissionHelper";
import { useAppSelector } from "@/lib/hooks";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Autocomplete,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function BaseInfo({ formik, onDelete }) {
  const t = useTranslations();
  const [haveDeletePermission, setHaveDeletePermission] = useState(false);
  const [options, setOptions] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const currentUser = useAppSelector(state => state.user);
  const currentPage = useAppSelector(state => state.common.page);
  const [optionsPage, setOptionsPage] = useState(1);
  const [optionsPageSize, setOptionsPageSize] = useState(-1);
  const [optionsFilters, setOptionsFilters] = useState([]);

  useEffect(() => {
    fetchData();
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

  const fetchData = async () => {
    try {
      const response = await RoleApi.list(optionsPage, optionsPageSize, optionsFilters);

      if (response.data) {
        setOptions(response.data);
      }
    } catch (error) {
      console.log(error);
      ReactSwal.fire({
        icon: "error",
        html: error.message,
      });
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 5,
      }}
    >
      <CardHeader
        title={t("user.user_information")}
        subheader={<Typography variant="caption">{t("user.manage_user")}</Typography>}
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
          <DebugLogger title={"User"} data={formik.values} hidden={true} />

          <ValidationTextField
            name={"username"}
            type={"text"}
            required
            value={formik.values.username || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            title={t("user.username")}
            errorText={formik.errors.username}
            touched={formik.touched.username}
          />

          <ValidationTextField
            name={"email"}
            type={"email"}
            required
            value={formik.values.email || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            title={t("user.email")}
            errorText={formik.errors.email}
            touched={formik.touched.email}
          />

          <ValidationTextField
            name={"password"}
            type={"password"}
            required={formik?.values?.id ? false : true}
            value={formik.values.password || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            title={t("user.password")}
            errorText={formik.errors.password}
            touched={formik.touched.password}
          />

          <Autocomplete
            filterSelectedOptions
            isOptionEqualToValue={(opt, value) => {
              return opt.value === value.value;
            }}
            multiple
            value={formik.values.roles || []}
            options={options.map(role => {
              return {
                label: role.name,
                value: role.id,
              };
            })}
            getOptionLabel={opt => opt.label}
            onChange={(event, newValue) => {
              formik.setFieldValue("roles", newValue);
            }}
            renderInput={params => <TextField required {...params} label={t("user.roles")} />}
          />

          <UpdaterInfo data={formik.values} />
        </Stack>
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between", px: 2 }}></CardActions>
    </Card>
  );
}
