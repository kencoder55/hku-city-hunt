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
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function BaseInfo({ id, formik, onDelete }) {
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
        title={id ? t("redemption_codes.edit_redemption_code") : t("redemption_codes.new_redemption_code")}
        subheader={<Typography variant="caption">{t("redemption_codes.code")}</Typography>}
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
          <FormControl fullWidth required>
            <InputLabel id="redemption-code-type-label">{t("redemption_codes.type")}</InputLabel>
            <Select
              labelId="redemption-code-type-label"
              name="type"
              value={formik.values.type || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label={t("redemption_codes.type")}
              error={formik.touched.type && Boolean(formik.errors.type)}
            >
              <MenuItem value="samgor">{t("redemption_codes.samgor")}</MenuItem>
              <MenuItem value="tamjai">{t("redemption_codes.tamjai")}</MenuItem>
              <MenuItem value="eslite">{t("redemption_codes.eslite")}</MenuItem>
              <MenuItem value="mtr">{t("redemption_codes.mtr")}</MenuItem>
              <MenuItem value="thealchemistcafe">{t("redemption_codes.thealchemistcafe")}</MenuItem>
            </Select>
            {formik.touched.type && formik.errors.type && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                {formik.errors.type}
              </Typography>
            )}
          </FormControl>

          <ValidationTextField
            name={"code"}
            type={"text"}
            required
            value={formik.values.code || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            title={t("redemption_codes.code")}
            errorText={formik.errors.code}
            touched={formik.touched.code}
          />

          <FormControlLabel
            control={
              <Checkbox
                name="isUsed"
                checked={formik.values.isUsed || false}
                onChange={formik.handleChange}
              />
            }
            label={t("redemption_codes.is_used")}
          />

          <UpdaterInfo data={formik.values} />
        </Stack>
      </CardContent>
    </Card>
  );
}
