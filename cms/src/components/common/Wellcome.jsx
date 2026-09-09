import { Box, Container, Divider, Paper, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function Welcome() {
  const t = useTranslations();

  return (
    <Container maxWidth={false}>
      <Paper sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Box
            component={"img"}
            src="/assets/icons/logo-long.jpg"
            sx={{
              width: "30%",
            }}
          />
          <Typography variant="h5">{`${process.env.NEXT_PUBLIC_PROJECT_NAME} ${t(
            "layout.welcome_header",
          )}`}</Typography>
          <Divider flexItem />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 3,
            mt: 2,
          }}
        >
          <Typography variant="caption" color={"gray"}>
            {t("layout.version")} : {process.env.NEXT_PUBLIC_VERSION}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
