import { Grid, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function UpdaterInfo({ data }) {
  const t = useTranslations();

  return (
    <Grid
      size={12}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 1,
      }}
    >
      {data.createdBy && data.createdAt && (
        <Typography variant="caption">
          {t("layout.created_by")}: {data.createdBy} - {data.createdAt}
        </Typography>
      )}

      {data.updatedBy && data.updatedAt && (
        <Typography variant="caption">
          {t("layout.updated_by")}: {data.updatedBy} - {data.updatedAt}
        </Typography>
      )}
    </Grid>
  );
}
