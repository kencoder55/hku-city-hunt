"use client";

import LanguageDropdown from "@/components/common/LanguageDropdown";
import ValidationTextField from "@/components/common/ValidationTextField";
import { MemberApi } from "@/data/MemberApi";
import ReactSwal from "@/helper/AlertHelper";
import { sendLogin } from "@/helper/GAHelper";
import { getAuthCookieName } from "@/helper/GlobalValueHelper";
import { useRouter } from "@/i18n/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { updateJwtState, updateUserInfo } from "@/lib/reducers/userSlice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";
import { setCookie } from "cookies-next/client";
import { useFormik } from "formik";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";

export default function Login() {
  const t = useTranslations();
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const redirect = searchParams.get("redirect");

  const KEY = getAuthCookieName();

  const loginSchema = Yup.object().shape({
    account: Yup.string().required(t("members.login.account_required")),
    password: Yup.string().required(t("members.login.password_required")),
  });

  const formik = useFormik({
    initialValues: {
      account: "",
      password: "",
    },
    validateOnMount: true,
    validationSchema: loginSchema,
  });

  const handleLogin = async () => {
    try {
      formik.setTouched({
        account: true,
        password: true,
      });

      await formik.validateForm();

      if (!formik.isValid) {
        return;
      }

      setIsLoading(true);

      const result = await MemberApi.login(formik.values.account, formik.values.password);

      const userInfo = {
        id: result.id,
        name: result.name,
        avatarId: result.avatarId,
        jwt: result.jwt,
      };

      setCookie(KEY, JSON.stringify(userInfo), { maxAge: 30 * 24 * 60 * 60 });
      dispatch(updateUserInfo({ id: result.id, name: result.name }));
      dispatch(updateJwtState(result.jwt));

      // Send GA login event
      sendLogin();

      // check if email is verified, if not, redirect to email verification page
      if (!result.isEmailVerified) {
        window.location.href = `/${locale}/members/email-verification`;
        return;
      }

      // check if the phone verified, if not, redirect to phone verification page
      if (!result.isSmsVerified) {
        window.location.href = `/${locale}/members/phone-verification`;
        return;
      }

      if (redirect) {
        window.location.href = redirect;
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.error(error);
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
        flexDirection: "column",
        backgroundImage: "url('/assets/images/login-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "bottom",
        height: "100vh",
        height: "100dvh",
      }}
    >
      <IconButton
        sx={{
          position: "absolute",
          top: 8,
          left: 8,
        }}
      >
        <ArrowBackIcon onClick={() => router.push("/")} />
      </IconButton>

      <Box
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
        }}
      >
        <LanguageDropdown />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pt: 6,
          pb: 4,
          gap: 4,
        }}
      >
        <Box
          component={"img"}
          src="/assets/images/nlpra-logo.svg"
          alt="NLPRA Logo"
          sx={{
            maxWidth: "100%",
            height: 80,
          }}
        />

        <Box
          component={"img"}
          src="/assets/icons/title-logo.png"
          alt="DNA 校園定向"
          sx={{
            width: 200,
            maxWidth: "100%",
            height: "auto",
          }}
        />
      </Box>
      <Stack spacing={1} width={"100%"} alignItems={"center"}>
        <ValidationTextField
          name="account"
          type={"text"}
          value={formik.values.account}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder={t("members.login.account")}
          errorText={formik.errors.account}
          touched={formik.touched.account}
        />

        <ValidationTextField
          name="password"
          type={showPassword ? "text" : "password"}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder={t("members.login.password")}
          errorText={formik.errors.password}
          touched={formik.touched.password}
          onKeyDown={event => {
            if (event.key === "Enter") {
              handleLogin();
            }
          }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(prev => !prev)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />

        <Box width={200} pt={2}>
          <Button fullWidth variant="contained" onClick={handleLogin} disabled={isLoading}>
            {t("members.login.login_button")}
          </Button>
        </Box>

        <Box width={200}>
          <Button
            fullWidth
            variant="secondary"
            onClick={() => router.push("/members/register")}
            disabled={isLoading}
          >
            {t("members.login.register_button")}
          </Button>
        </Box>

        <Button
          variant="text"
          sx={{
            textTransform: "none",
            color: "inherit",
          }}
          onClick={() => router.push("/members/forgot-password/send")}
        >
          <Typography variant="body2">{t("members.login.forgot_password")}</Typography>
        </Button>
      </Stack>
    </Container>
  );
}
