import DebugLogger from "@/components/common/DebugLogger";
import ImageUploader from "@/components/common/ImageUploader";
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
  Grid,
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
  const currentUser = useAppSelector(state => state.user);
  const currentPage = useAppSelector(state => state.common.page);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [showImageUploader, setShowImageUploader] = useState(false);

  useEffect(() => {
    const deletePermission = checkPermission(currentUser, currentPage, "delete");
    setHaveDeletePermission(deletePermission);
  }, [currentUser, currentPage]);

  useEffect(() => {
    if (formik.values.image) {
      setShowImageUploader(false);
    } else if (formik.values.files && formik.values.files.length > 0) {
      setShowImageUploader(false);
    } else {
      setShowImageUploader(true);
    }
  }, [formik]);

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
    let files = formik.values.files || [];

    // check if file exists
    let fileExists = false;
    files.forEach(file => {
      images.forEach(image => {
        if (file.name === image.name) {
          fileExists = true;
          return;
        }
      });
    });

    if (fileExists) {
      return;
    }

    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        if (image.file.size > 1024 * 1024 * maxUploadFileMb) {
          ReactSwal.fire({
            icon: "error",
            title: t("error.error"),
            text: `Image file size must be less than ${maxUploadFileMb}MB`,
          });

          return;
        }

        const resizedImage = await resizeFile({
          file: image.file,
        });

        files.push(resizedImage);
      }
    }

    formik.setFieldValue("files", files);
  };

  const removeUploadFile = index => {
    ReactSwal.fire({
      title: t("error.warning"),
      text: t("error.delete_confirm"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("layout.ok"),
      cancelButtonText: t("layout.cancel"),
    }).then(result => {
      if (result.isConfirmed) {
        let newUploadFiles = formik.values.files;
        newUploadFiles.splice(index, 1);
        formik.setFieldValue("files", newUploadFiles);
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
        formik.setFieldValue("image", "");
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
        title={t("banners.banner_information")}
        subheader={<Typography variant="caption">{t("banners.manage_banner")}</Typography>}
        action={
          onDelete && (
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
                  {<Typography color={"error"}>{t("layout.delete")}</Typography>}
                </MenuItem>
              </Menu>
            </Box>
          )
        }
      />
      <CardContent>
        <Stack spacing={2}>
          <DebugLogger title="Banners" data={formik.values} hidden={true} />
          <Box
            sx={{
              fontWight: "bold",
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
              {(formik.values.image != "" || formik.values.image != null) && formik.values.image ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box component={"img"} src={formik.values.image} maxWidth={"100%"} />

                  <Button onClick={removeImage} fullWidth>
                    {t("layout.delete")}
                  </Button>
                </Box>
              ) : (
                <Box>
                  {formik.values.files &&
                    formik.values.files.length > 0 &&
                    formik.values.files.map((file, index) => (
                      <Stack key={index}>
                        <Box
                          component={"img"}
                          src={URL.createObjectURL(file)}
                          sx={{
                            objectFit: "contain",
                            maxWidth: "100%",
                            maxHeight: "200px",
                          }}
                        />
                        <Button
                          sx={{
                            my: 2,
                          }}
                          onClick={() => {
                            removeUploadFile(index);
                          }}
                        >
                          {t("layout.delete")}
                        </Button>
                      </Stack>
                    ))}
                </Box>
              )}

              {showImageUploader && (
                <ImageUploader
                  images={formik.values.files || []}
                  onImageChange={onImageChange}
                  acceptType={["jpeg", "jpg", "gif", "png", "webp", "heic"]}
                  maxNumber={1}
                  removeAllButton={formik?.values?.image || formik?.values?.files?.length > 0}
                  maxFileSize={maxUploadFileMb * 1024 * 1024}
                />
              )}
            </Stack>

            <Grid
              container
              spacing={2}
              sx={{
                py: 2,
                width: "100%",
              }}
            >
              <Grid size={6}>
                <ValidationTextField
                  name={"titleZh"}
                  type={"text"}
                  required
                  value={formik.values.titleZh || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  title={t("banners.title_zh")}
                  errorText={formik.errors.titleZh}
                  touched={formik.touched.titleZh}
                />
              </Grid>

              <Grid size={6}>
                <ValidationTextField
                  name={"titleEn"}
                  type={"text"}
                  required
                  value={formik.values.titleEn || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  title={t("banners.title_en")}
                  errorText={formik.errors.titleEn}
                  touched={formik.touched.titleEn}
                />
              </Grid>

              <Grid size={6}>
                <ValidationTextField
                  name={"subtitleZh"}
                  type={"text"}
                  value={formik.values.subtitleZh || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  title={t("banners.subtitle_zh")}
                  errorText={formik.errors.subtitleZh}
                  touched={formik.touched.subtitleZh}
                />
              </Grid>

              <Grid size={6}>
                <ValidationTextField
                  name={"subtitleEn"}
                  type={"text"}
                  value={formik.values.subtitleEn || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  title={t("banners.subtitle_en")}
                  errorText={formik.errors.subtitleEn}
                  touched={formik.touched.subtitleEn}
                />
              </Grid>

              <Grid size={6}>
                <ValidationTextField
                  name={"descriptionZh"}
                  type={"text"}
                  multiline
                  minRows={4}
                  value={formik.values.descriptionZh || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  title={t("banners.description_zh")}
                  errorText={formik.errors.descriptionZh}
                  touched={formik.touched.descriptionZh}
                />
              </Grid>

              <Grid size={6}>
                <ValidationTextField
                  name={"descriptionEn"}
                  type={"text"}
                  multiline
                  minRows={4}
                  value={formik.values.descriptionEn || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  title={t("banners.description_en")}
                  errorText={formik.errors.descriptionEn}
                  touched={formik.touched.descriptionEn}
                />
              </Grid>
            </Grid>

            <Stack
              spacing={2}
              sx={{
                width: "100%",
              }}
            >
              <ValidationTextField
                name={"link"}
                type={"text"}
                value={formik.values.link || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                title={t("banners.link")}
                errorText={formik.errors.link}
                touched={formik.touched.link}
              />

              <UpdaterInfo data={formik.values} />
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
