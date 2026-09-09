import UpdaterInfo from "@/components/common/UpdaterInfo";
import ValidationTextField from "@/components/common/ValidationTextField";
import ReactSwal from "@/helper/AlertHelper";
import { checkPermission } from "@/helper/PermissionHelper";
import { useAppSelector } from "@/lib/hooks";
import palette from "@/styles/theme/palette";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  ButtonBase,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControl,
  FormControlLabel,
  FormLabel,
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

const avatarOptions = [
  { value: 1, image: "/assets/icons/avatar/1.png" },
  { value: 2, image: "/assets/icons/avatar/2.png" },
  { value: 3, image: "/assets/icons/avatar/3.png" },
  { value: 4, image: "/assets/icons/avatar/4.png" },
  { value: 5, image: "/assets/icons/avatar/5.png" },
];

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
        title={t("members.member_information")}
        subheader={<Typography variant="caption">{t("members.manage_member")}</Typography>}
        action={
          onDelete ? (
            <Box>
              <IconButton onClick={handleClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
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
          <Box>
            <Box>{t("members.avatar")}</Box>
            <Box>
              {formik.touched.avatarId && formik.errors.avatarId && (
                <Typography variant="caption" color="error">
                  {formik.errors.avatarId}
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              {avatarOptions.map(option => (
                <ButtonBase
                  key={option.value}
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 32,
                    cursor: "pointer",
                    position: "relative",
                    m: 1,
                    border:
                      formik.values.avatarId === option.value
                        ? `2px solid ${palette.primary.main}`
                        : "2px solid transparent",
                  }}
                  onClick={() => formik.setFieldValue("avatarId", option.value)}
                >
                  <Box
                    component="img"
                    src={option.image}
                    alt={`avatar-${option.value}`}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      borderRadius: "50%",
                    }}
                  />

                  <Box
                    component="img"
                    src={"/assets/icons/comfirmed.svg"}
                    sx={{
                      width: 15,
                      height: 15,
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      display: formik.values.avatarId === option.value ? "block" : "none",
                    }}
                  />
                </ButtonBase>
              ))}
            </Box>
          </Box>

          <ValidationTextField
            name={"name"}
            type={"text"}
            required
            value={formik.values.name || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            title={t("members.name")}
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
            title={t("members.email")}
            errorText={formik.errors.email}
            touched={formik.touched.email}
          />

          <FormControl fullWidth>
            <InputLabel>{t("members.age")}</InputLabel>
            <Select
              name={"age"}
              label={t("members.age")}
              value={formik.values.age || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <MenuItem value="<20">{`<20`}</MenuItem>
              <MenuItem value="20-34">20-34</MenuItem>
              <MenuItem value="35-54">35-54</MenuItem>
              <MenuItem value=">=55">{`>=55`}</MenuItem>
            </Select>

            {formik.touched.age && formik.errors.age && (
              <Typography variant="caption" color="error">
                {formik.errors.age}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>{t("members.gender")}</InputLabel>
            <Select
              name={"gender"}
              label={t("members.gender")}
              value={formik.values.gender || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <MenuItem value="male">{t("members.male")}</MenuItem>
              <MenuItem value="female">{t("members.female")}</MenuItem>
              <MenuItem value="other">{t("members.prefer_not_to_say")}</MenuItem>
            </Select>

            {/* Show gender error message */}
            {formik.touched.gender && formik.errors.gender && (
              <Typography variant="caption" color="error">
                {formik.errors.gender}
              </Typography>
            )}
          </FormControl>

          <ValidationTextField
            name={"phone"}
            type={"text"}
            required
            value={formik.values.phone || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            title={t("members.phone")}
            errorText={formik.errors.phone}
            touched={formik.touched.phone}
          />

          <ValidationTextField
            name={"password"}
            type={"password"}
            required={formik?.values?.id ? false : true}
            value={formik.values.password || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            title={t("members.password")}
            errorText={formik.errors.password}
            touched={formik.touched.password}
          />

          <UpdaterInfo data={formik.values} />
        </Stack>
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between", px: 2 }}></CardActions>
    </Card>
  );
}
