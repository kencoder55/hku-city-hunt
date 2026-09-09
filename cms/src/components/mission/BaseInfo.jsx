"use client";

import UpdaterInfo from "@/components/common/UpdaterInfo";
import ValidationTextField from "@/components/common/ValidationTextField";
import { Card, CardContent, CardHeader, Stack, Typography, Box, IconButton, Menu, MenuItem } from "@mui/material";
import { useTranslations } from "next-intl";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { JsonEditor } from "json-edit-react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState, useEffect } from "react";
import { useAppSelector } from "@/lib/hooks";
import { checkPermission } from "@/helper/PermissionHelper";
import ReactSwal from "@/helper/AlertHelper";

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
    handleClose();
    if (onDelete) {
      onDelete();
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
        title={formik.values.id ? t("missions.edit_mission") : t("missions.new_mission")}
        subheader={t("missions.mission_info")}
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
            title={t("missions.slug")}
            errorText={formik.errors.slug}
            touched={formik.touched.slug}
          />

          <ValidationTextField
            name={"nameZh"}
            type={"text"}
            required
            value={formik.values.nameZh || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            title={t("missions.name") + " (中文)"}
            errorText={formik.errors.nameZh}
            touched={formik.touched.nameZh}
          />

          <ValidationTextField
            name={"nameEn"}
            type={"text"}
            value={formik.values.nameEn || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            title={t("missions.name") + " (English)"}
            errorText={formik.errors.nameEn}
            touched={formik.touched.nameEn}
          />

          <ValidationTextField
            name={"type"}
            type={"text"}
            value={formik.values.type || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            title={t("missions.type")}
            errorText={formik.errors.type}
            touched={formik.touched.type}
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

          <ValidationTextField
            name={"category"}
            type={"text"}
            value={formik.values.category || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            title={t("missions.category")}
            errorText={formik.errors.category}
            touched={formik.touched.category}
          />

          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DateTimePicker
              ampm={false}
              inputFormat="YYYY-MM-DD HH:mm:ss"
              slotProps={{ textField: { fullWidth: true, required: true } }}
              label={t("missions.start_time")}
              value={formik.values.startTime ? moment(formik.values.startTime) : null}
              onChange={newValue => {
                if (newValue) {
                  const formattedValue = moment(newValue).format("YYYY-MM-DD HH:mm:ss");
                  formik.setTouched({ startTime: true });
                  formik.setFieldValue("startTime", formattedValue);
                }
              }}
              format="YYYY-MM-DD HH:mm:ss"
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DateTimePicker
              ampm={false}
              inputFormat="YYYY-MM-DD HH:mm:ss"
              slotProps={{ textField: { fullWidth: true, required: true } }}
              label={t("missions.end_time")}
              value={formik.values.endTime ? moment(formik.values.endTime) : null}
              onChange={newValue => {
                if (newValue) {
                  const formattedValue = moment(newValue).format("YYYY-MM-DD HH:mm:ss");
                  formik.setTouched({ endTime: true });
                  formik.setFieldValue("endTime", formattedValue);
                }
              }}
              format="YYYY-MM-DD HH:mm:ss"
            />
          </LocalizationProvider>

          <Stack spacing={1}>
            <Typography sx={{ fontWeight: "bold" }}>{t("missions.location")}</Typography>
            <JsonEditor
              data={formik.values.location || []}
              setData={data => {
                formik.setFieldValue("location", data);
              }}
              rootName="location"
              collapse={2}
            />
          </Stack>

          <Stack spacing={1}>
            <Typography sx={{ fontWeight: "bold" }}>{t("missions.parameter")}</Typography>
            <JsonEditor
              data={formik.values.parameter || {}}
              setData={data => {
                formik.setFieldValue("parameter", data);
              }}
              rootName="parameter"
              collapse={2}
            />
          </Stack>

          <UpdaterInfo data={formik.values} />
        </Stack>
      </CardContent>
    </Card>
  );
}
