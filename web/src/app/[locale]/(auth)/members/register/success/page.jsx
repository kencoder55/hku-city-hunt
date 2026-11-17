"use client";
import { Link, useRouter } from "@/i18n/navigation";
import { Button, Container, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useLocale, useTranslations } from "next-intl";

export default function RegisterSuccess() {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();

  return (
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          position: "relative",
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
            py: 4,
          }}
        />

        <Box
          component="img"
          src={`/assets/images/register-success-${locale}.svg`}
          sx={{
            width: "60%",
            height: "auto",
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          py: 2,
        }}
      >
        <Button
          fullWidth
          variant="contained"
          onClick={() => {
            router.push("/");
          }}
        >
          {t("members.register_success.back_to_home")}
        </Button>
      </Box>
    </Container>
  );
}
