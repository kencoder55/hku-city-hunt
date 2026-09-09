import UpdaterInfo from "@/components/common/UpdaterInfo";
import ValidationTextField from "@/components/common/ValidationTextField";
import ReactSwal from "@/helper/AlertHelper";
import { maxUploadFileMb } from "@/helper/GlobalValueHelper";
import { checkPermission } from "@/helper/PermissionHelper";
import { resizeFile } from "@/helper/UnitsHelper";
import { useAppSelector } from "@/lib/hooks";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
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
import ImageUploader from "../common/ImageUploader";

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

  const onImageChange = async images => {
    if (images && images.length > 0) {
      const image = images[0];
      if (image.file.size > 1024 * 1024 * maxUploadFileMb) {
        ReactSwal.fire({
          icon: "error",
          title: t("error.title"),
          text: `Image file size must be less than ${maxUploadFileMb}MB`,
        });
        return;
      }

      const resizedImage = await resizeFile({
        file: image.file,
      });

      formik.setFieldValue("file", resizedImage);
    }
  };

  const removeUploadFile = () => {
    ReactSwal.fire({
      title: t("error.warning"),
      text: t("error.delete_confirm"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("layout.ok"),
      cancelButtonText: t("layout.cancel"),
    }).then(result => {
      if (result.isConfirmed) {
        formik.setFieldValue("file", null);
      }
    });
  };

  const removeImage = () => {
    ReactSwal.fire({
      title: t("error.warning"),
      text: t("error.delete_confirm"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("layout.ok"),
      cancelButtonText: t("layout.cancel"),
    }).then(result => {
      if (result.isConfirmed) {
        formik.setFieldValue("coverImage", "");
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
        title={id ? t("products.edit_product") : t("products.new_product")}
        subheader={<Typography variant="caption">{t("products.name")}</Typography>}
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
          <Box
            sx={{
              fontWeight: "bold",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography variant="caption">
              {t("layout.maximum_upload_size")}: {maxUploadFileMb} MB
            </Typography>
            <Typography variant="caption">
              {t("layout.accept_file_type")}: JPEG / JPG / GIF / PNG / WEBP / HEIC
            </Typography>
          </Box>

          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Stack width={"100%"} spacing={2}>
              {formik.values.coverImage && (
                <Box>
                  <Box
                    component={"img"}
                    src={formik.values.coverImage}
                    sx={{
                      objectFit: "contain",
                      maxWidth: "100%",
                      maxHeight: "200px",
                    }}
                  />
                  <Button onClick={removeImage} fullWidth sx={{ mt: 2 }}>
                    {t("layout.delete")}
                  </Button>
                </Box>
              )}

              {formik.values.file && (
                <Box>
                  <Box
                    component={"img"}
                    src={URL.createObjectURL(formik.values.file)}
                    sx={{
                      objectFit: "contain",
                      maxWidth: "100%",
                      maxHeight: "200px",
                    }}
                  />
                  <Button onClick={removeUploadFile} fullWidth sx={{ mt: 2 }}>
                    {t("layout.delete")}
                  </Button>
                </Box>
              )}
            </Stack>

            <Stack width={"100%"}>
              <ImageUploader
                images={[]}
                onImageChange={onImageChange}
                acceptType={["jpeg", "jpg", "gif", "png", "webp", "heic"]}
                maxNumber={1}
                maxFileSize={maxUploadFileMb * 1024 * 1024}
              />
            </Stack>
          </Box>

          <ValidationTextField
            name={"nameZh"}
            type={"text"}
            required
            value={formik.values.nameZh || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            title={t("products.name") + " (中文)"}
            errorText={formik.errors.nameZh}
            touched={formik.touched.nameZh}
          />

          <ValidationTextField
            name={"nameEn"}
            type={"text"}
            value={formik.values.nameEn || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            title={t("products.name") + " (English)"}
            errorText={formik.errors.nameEn}
            touched={formik.touched.nameEn}
          />

          <ValidationTextField
            name={"descriptionZh"}
            type={"text"}
            multiline
            minRows={4}
            value={formik.values.descriptionZh || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            title={t("layout.remark") + " (中文)"}
            errorText={formik.errors.descriptionZh}
            touched={formik.touched.descriptionZh}
          />

          <ValidationTextField
            name={"descriptionEn"}
            type={"text"}
            multiline
            minRows={4}
            value={formik.values.descriptionEn || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            title={t("layout.remark") + " (English)"}
            errorText={formik.errors.descriptionEn}
            touched={formik.touched.descriptionEn}
          />

          <FormControl fullWidth>
            <InputLabel id="product-type-label">{t("products.type")}</InputLabel>
            <Select
              labelId="product-type-label"
              name="type"
              value={formik.values.type || "product"}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label={t("products.type")}
              error={formik.touched.type && Boolean(formik.errors.type)}
            >
              <MenuItem value="product">{t("products.physical_product")}</MenuItem>
              <MenuItem value="mtr500">{t("products.mtr500_coupon")}</MenuItem>
              <MenuItem value="mtr1000">{t("products.mtr1000_coupon")}</MenuItem>
              <MenuItem value="eslite">{t("products.eslite_coupon")}</MenuItem>
              <MenuItem value="thealchemistcafe">{t("products.thealchemistcafe_coupon")}</MenuItem>
            </Select>
            {formik.touched.type && formik.errors.type && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                {formik.errors.type}
              </Typography>
            )}
          </FormControl>

          <ValidationTextField
            name={"stock"}
            type={"number"}
            disabled={formik.values.type !== "product"}
            required
            value={formik.values.stock || 0}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            title={t("products.stock")}
            errorText={formik.errors.stock}
            touched={formik.touched.stock}
          />

          <ValidationTextField
            name={"requiredRewards"}
            type={"number"}
            required
            value={formik.values.requiredRewards || 0}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            title={t("products.required_rewards")}
            errorText={formik.errors.requiredRewards}
            touched={formik.touched.requiredRewards}
          />

          <ValidationTextField
            name={"redemptionDateZh"}
            type={"text"}
            value={formik.values.redemptionDateZh || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            title={t("products.redemption_date") + " (中文)"}
            errorText={formik.errors.redemptionDateZh}
            touched={formik.touched.redemptionDateZh}
          />

          <ValidationTextField
            name={"redemptionDateEn"}
            type={"text"}
            value={formik.values.redemptionDateEn || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            title={t("products.redemption_date") + " (English)"}
            errorText={formik.errors.redemptionDateEn}
            touched={formik.touched.redemptionDateEn}
          />

          <ValidationTextField
            name={"redemptionLink"}
            type={"text"}
            value={formik.values.redemptionLink || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            title={t("products.redemption_link")}
            errorText={formik.errors.redemptionLink}
            touched={formik.touched.redemptionLink}
          />

          <UpdaterInfo data={formik.values} />
        </Stack>
      </CardContent>
    </Card>
  );
}
