import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function AppVersion() {
  const t = useTranslations();

  return (
    <Box>
      <Typography variant="caption" color={"gray"}>
        {t("layout.version")} : {process.env.NEXT_PUBLIC_VERSION}
      </Typography>
    </Box>
  );
}
