"use client";

import ValidationTextField from "@/components/common/ValidationTextField";
import { MemberApi } from "@/data/MemberApi";
import ReactSwal from "@/helper/AlertHelper";
import { sendSignUp } from "@/helper/GAHelper";
import { getAuthCookieName } from "@/helper/GlobalValueHelper";
import { useRouter } from "@/i18n/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { updateJwtState, updateUserInfo } from "@/lib/reducers/userSlice";
import palette from "@/styles/theme/palette";
import {
  Box,
  Button,
  ButtonBase,
  Container,
  MenuItem,
  Select,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { deleteCookie, setCookie } from "cookies-next/client";
import { useFormik } from "formik";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import * as Yup from "yup";

// Avatar icons (1-5)
const avatarOptions = [
  { value: 1, image: "/assets/icons/avatar/1.png" },
  { value: 2, image: "/assets/icons/avatar/2.png" },
  { value: 3, image: "/assets/icons/avatar/3.png" },
  { value: 4, image: "/assets/icons/avatar/4.png" },
  { value: 5, image: "/assets/icons/avatar/5.png" },
];

export default function Register() {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const KEY = getAuthCookieName();
  const locale = useLocale();

  useEffect(() => {
    // clear auth cookie on mount
    deleteCookie(KEY);
  }, []);

  const registerSchema = Yup.object().shape({
    avatarId: Yup.number()
      .required(t("members.validation.required"))
      .min(1, t("members.validation.required"))
      .max(5, t("members.validation.required")),
    name: Yup.string().required(t("members.validation.required")),
    email: Yup.string()
      .required(t("members.validation.required"))
      .email(t("members.validation.invalid")),
    gender: Yup.string().required(t("members.validation.required")),
    age: Yup.string()
      .required(t("members.validation.age_required"))
      .oneOf(["<20", "20-34", "35-54", ">=55"], t("members.validation.age_required")),
    password: Yup.string()
      .required(t("members.validation.password_required"))
      .min(8, t("members.validation.password_min_length"))
      .matches(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, t("members.validation.password_format")),
    confirmPassword: Yup.string()
      .required(t("members.validation.confirm_password_required"))
      .oneOf([Yup.ref("password")], t("members.validation.password_mismatch")),
  });

  const formik = useFormik({
    initialValues: {
      avatarId: 1,
      name: "",
      email: "",
      gender: "",
      age: "",
      password: "",
      confirmPassword: "",
    },
    validateOnMount: true,
    validationSchema: registerSchema,
  });

  const handleRegister = async () => {
    try {
      formik.setTouched({
        avatarId: true,
        name: true,
        email: true,
        gender: true,
        age: true,
        password: true,
        confirmPassword: true,
      });

      await formik.validateForm();

      console.log(formik);

      if (!formik.isValid) {
        return;
      }

      setIsLoading(true);

      // Registration logic goes here
      const response = await MemberApi.register(
        formik.values.avatarId,
        formik.values.name,
        formik.values.email,
        formik.values.gender,
        formik.values.age,
        formik.values.password,
      );

      console.log("Registration successful:", response);

      const userInfo = {
        id: response.id,
        name: response.name,
        avatarId: response.avatarId,
        jwt: response.jwt,
      };

      setCookie(KEY, JSON.stringify(userInfo), { maxAge: 30 * 24 * 60 * 60 });
      dispatch(updateUserInfo({ id: response.id, name: response.name }));
      dispatch(updateJwtState(response.jwt));

      // Send GA sign up event
      sendSignUp();

      window.location.href = `/${locale}/members/email-verification`;
    } catch (error) {
      console.error("Registration error:", error);
      ReactSwal.fire({
        icon: "error",
        title: t("error.title"),
        html: t(error.message || "error.unknown"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        py: 4,
        gap: 2,
      }}
    >
      <Box
        component={"img"}
        src="/assets/icons/title-logo.png"
        alt="DNA 校園定向"
        sx={{
          width: 200,
          maxWidth: "100%",
          height: "auto",
          pb: 2,
        }}
      />

      <Box
        sx={{
          width: "100%",
          py: 1,
        }}
      >
        <Typography color={palette.text.secondary}>{t("members.register.avatar")} *</Typography>

        <Box>
          {formik.touched.avatarId && formik.errors.avatarId && (
            <Typography variant="caption" color="error">
              {t(formik.errors.avatarId)}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: 1,
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
              }}
              onClick={() => formik.setFieldValue("avatarId", option.value)}
            >
              <Box
                component="img"
                src={option.image}
                alt={`Avatar ${option.value}`}
                sx={{ width: "100%", height: "100%", objectFit: "contain" }}
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
        name="name"
        type="text"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        title={t("members.register.name")}
        errorText={formik.errors.name}
        touched={formik.touched.name}
        required
      />

      <ValidationTextField
        name="email"
        type="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        title={t("members.register.email")}
        errorText={formik.errors.email}
        touched={formik.touched.email}
        required
      />

      <Box
        sx={{
          width: "100%",
        }}
      >
        <Typography color={palette.text.secondary}>{t("members.register.gender")} *</Typography>
        <Select
          name={"gender"}
          value={formik.values.gender || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          sx={{
            width: "100%",
          }}
        >
          <MenuItem value="male">{t("members.register.male")}</MenuItem>
          <MenuItem value="female">{t("members.register.female")}</MenuItem>
          <MenuItem value="other">{t("members.register.prefer_not_to_say")}</MenuItem>
        </Select>
        {formik.touched.gender && formik.errors.gender && (
          <Typography variant="caption" color="error">
            {t(formik.errors.gender)}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          width: "100%",
        }}
      >
        <Typography color={palette.text.secondary}>{t("members.register.age")} *</Typography>
        <Select
          name={"age"}
          value={formik.values.age || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          sx={{
            width: "100%",
          }}
        >
          <MenuItem value="<20">&lt;20</MenuItem>
          <MenuItem value="20-34">20-34</MenuItem>
          <MenuItem value="35-54">35-54</MenuItem>
          <MenuItem value=">=55">&gt;=55</MenuItem>
        </Select>
        {formik.touched.age && formik.errors.age && (
          <Typography variant="caption" color="error">
            {t(formik.errors.age)}
          </Typography>
        )}
      </Box>

      <ValidationTextField
        name="password"
        type={showPassword ? "text" : "password"}
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        title={t("members.register.password")}
        errorText={formik.errors.password}
        touched={formik.touched.password}
        required
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(prev => !prev)}
              edge="end"
              size="large"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />

      <ValidationTextField
        name="confirmPassword"
        type={showConfirmPassword ? "text" : "password"}
        value={formik.values.confirmPassword}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        title={t("members.register.confirm_password")}
        errorText={formik.errors.confirmPassword}
        touched={formik.touched.confirmPassword}
        required
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              onClick={() => setShowConfirmPassword(prev => !prev)}
              edge="end"
              size="large"
            >
              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />

      <Box sx={{ width: "100%", mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
        <Button variant="contained" fullWidth disabled={isLoading} onClick={handleRegister}>
          {t("members.register.next_button")}
        </Button>
        <Button
          variant="secondary"
          fullWidth
          disabled={isLoading}
          onClick={() => {
            router.push("/members/login");
          }}
        >
          {t("members.register.back_button")}
        </Button>
      </Box>
    </Container>
  );
}
