"use client";

import ValidationTextField from "@/components/common/ValidationTextField";
import AppVersion from "@/components/login/AppVersion";
import ForgotPassword from "@/components/login/ForgotPassword";
import { UserApi } from "@/data/UserApi";
import ReactSwal from "@/helper/AlertHelper";
import { getAuthCookieName } from "@/helper/GlobalValueHelper";
import { Box, Button, Card, CardActions, CardContent, Container, FormGroup } from "@mui/material";
import { setCookie } from "cookies-next/client";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";

export const createSchema = t => {
  return Yup.object().shape({
    username: Yup.string().required(t("error.please_fill_in_this_field")),
    password: Yup.string().required(t("error.please_fill_in_this_field")),
  });
};

export default function Login() {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const loginSchema = createSchema(t);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validateOnMount: true,
    validationSchema: loginSchema,
  });

  const login = async () => {
    try {
      formik.setTouched({
        username: true,
        password: true,
      });

      formik.validateForm();

      if (!formik.isValid) {
        return;
      }

      setIsLoading(true);

      const response = await UserApi.login(formik.values.username, formik.values.password);

      const data = response.data;

      if (data && data.success) {
        const result = data.result;
        const userInfo = {
          userId: result.id,
          username: result.username,
          jwt: result.jwt,
        };

        setCookie(getAuthCookieName(), JSON.stringify(userInfo));

        if (redirect) {
          window.location.href = redirect;
          return;
        }

        window.location.href = "/";
      } else {
        ReactSwal.fire({
          icon: "error",
          html: data.message,
        });
      }
    } catch (error) {
      console.log(error);
      ReactSwal.fire({
        icon: "error",
        html: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      display={"flex"}
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="sm">
        <Card raised sx={{ p: 4 }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                pb: 4,
              }}
            >
              <Box component={"img"} src={"/assets/icons/logo-long.jpg"} height={50} />
            </Box>
            <FormGroup>
              <Box sx={{ my: 2 }}>
                <ValidationTextField
                  name={"username"}
                  type={"text"}
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  title={t("layout.username")}
                  errorText={formik.errors.username}
                  touched={formik.touched.username}
                />
              </Box>
              <Box sx={{ my: 2 }}>
                <ValidationTextField
                  name={"password"}
                  type={"password"}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  title={t("layout.password")}
                  errorText={formik.errors.password}
                  touched={formik.touched.password}
                  onKeyDown={event => {
                    if (event.key == "Enter") {
                      login();
                    }
                  }}
                />
              </Box>
            </FormGroup>
          </CardContent>
          <CardActions>
            <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
              <Button
                disabled={isLoading}
                fullWidth
                variant="outlined"
                onClick={() => {
                  login();
                }}
              >
                {t("layout.login")}
              </Button>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <ForgotPassword />
                <AppVersion />
              </Box>
            </Box>
          </CardActions>
        </Card>
      </Container>
    </Box>
  );
}
