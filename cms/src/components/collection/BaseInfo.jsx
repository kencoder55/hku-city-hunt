import DebugLogger from "@/components/common/DebugLogger";
import UpdaterInfo from "@/components/common/UpdaterInfo";
import ValidationTextField from "@/components/common/ValidationTextField";
import { CategoryGroupApi } from "@/data/CategoryGroupApi";
import ReactSwal from "@/helper/AlertHelper";
import { collectionTypeList, maxUploadFileMb } from "@/helper/GlobalValueHelper";
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
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import FullScreenLoading from "../common/FullScreenLoading";
import ImageUploader from "../common/ImageUploader";
import ValidationAutocomplete from "../common/ValidationAutocomplete";
import ValidationSelect from "../common/ValidationSelect";

export default function BaseInfo({ formik, onDelete }) {
  const t = useTranslations();
  const [haveDeletePermission, setHaveDeletePermission] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const currentUser = useAppSelector(state => state.user);
  const currentPage = useAppSelector(state => state.common.page);
  const [categoryGroupOptions, setCategoryGroupOptions] = useState([]);
  const [categoryGroupOptionsPage, setCategoryGroupOptionsPage] = useState(1);
  const [categoryGroupOptionsPageSize, setCategoryGroupOptionsPageSize] = useState(-1);
  const [categoryGroupOptionsFilters, setCategoryGroupOptionsFilters] = useState([]);
  const [fullScreenLoading, setFullScreenLoading] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);

  useEffect(() => {
    fetchCategoryGroupOptionsData();
  }, []);

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

  const fetchCategoryGroupOptionsData = async () => {
    try {
      setFullScreenLoading(true);
      const response = await CategoryGroupApi.list(
        categoryGroupOptionsPage,
        categoryGroupOptionsPageSize,
        categoryGroupOptionsFilters,
      );

      if (response.data) {
        setCategoryGroupOptions(
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
      <FullScreenLoading open={fullScreenLoading} />
      <CardHeader
        title={t("collections.collection_information")}
        subheader={<Typography variant="caption">{t("collections.manage_collection")}</Typography>}
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
          <DebugLogger title={"Collections"} data={formik.values} hidden={true} />
          <DebugLogger title={"Category Group Options"} data={categoryGroupOptions} hidden={true} />

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
          </Box>

          <ValidationTextField
            name={"nameZh"}
            type={"text"}
            required
            value={formik.values.nameZh || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            title={t("collections.name_zh")}
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
            title={t("collections.name_en")}
            errorText={formik.errors.nameEn}
            touched={formik.touched.nameEn}
          />

          <ValidationTextField
            name={"slug"}
            type={"text"}
            required
            value={formik.values.slug || ""}
            onChange={event => {
              let slug = event.target.value.replace(/[^\p{L}\p{N}]+/gu, "-").toLowerCase();
              formik.setFieldValue("slug", slug);
            }}
            onBlur={formik.handleBlur}
            title={t("collections.slug")}
            errorText={formik.errors.slug}
            touched={formik.touched.slug}
          />

          <ValidationAutocomplete
            name={"categoryGroupIds"}
            value={formik.values.categoryGroupIds || []}
            onChange={(event, value) => {
              formik.setFieldValue("categoryGroupIds", value);
              if (value.length >= 1) {
                formik.setFieldTouched("categoryGroupIds", false);
              } else {
                formik.setFieldTouched("categoryGroupIds", true);
              }
            }}
            onBlur={formik.handleBlur}
            title={t("collections.category_group")}
            errorText={formik.errors.categoryGroupIds}
            touched={formik.touched.categoryGroupIds}
            options={categoryGroupOptions}
            disabled={!categoryGroupOptions || categoryGroupOptions.length === 0}
          />

          <ValidationSelect
            name={"type"}
            module={"collections"}
            required
            value={formik.values.type || ""}
            onChange={e => {
              formik.setFieldValue("type", e.target.value);
              formik.setFieldTouched("type", false);
            }}
            onBlur={formik.handleBlur}
            title={t("collections.type")}
            errorText={formik.errors.type}
            touched={formik.touched.type}
            options={collectionTypeList}
          />

          <UpdaterInfo data={formik.values} />
        </Stack>
      </CardContent>
    </Card>
  );
}
