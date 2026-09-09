"use client";
import AuthContainer from "@/components/common/AuthContainer";
import { useRouter } from "@/i18n/navigation";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useSelector } from "react-redux";
import { useTranslations } from "use-intl";

export default function Profile() {
  const router = useRouter();
  const user = useSelector(state => state.user);
  const t = useTranslations();

  return (
    <AuthContainer>
      <Container
        maxWidth={false}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          py: 4,
          height: "100%",
        }}
      >
        <Box
          component={"img"}
          src={`/assets/icons/avatar/${user?.avatarId || 1}.png`}
          alt={t("members.profile.avatar_alt")}
          sx={{ width: 120, height: 120, borderRadius: "50%", backgroundColor: "white" }}
        />
        <Stack width={"100%"} spacing={1} pb={2} flex={1}>
          <Stack>
              <Typography variant="subtitle2">{t("members.profile.name")}</Typography>
            <TextField value={user?.name} fullWidth />
          </Stack>

          <Stack>
              <Typography variant="subtitle2">{t("members.profile.email")}</Typography>
            <TextField
              value={user?.email}
              fullWidth
              slotProps={{
                input: {
                  endAdornment: user?.isEmailVerified ? <CheckCircleIcon color="success" /> : null,
                },
              }}
            />
          </Stack>

          <Stack>
              <Typography variant="subtitle2">{t("members.profile.phone")}</Typography>
            <TextField
              value={user?.phone}
              fullWidth
                // 若已驗證手機，於輸入框末端顯示已驗證標記
              slotProps={{
                input: {
                  endAdornment: user?.isSmsVerified ? <CheckCircleIcon color="success" /> : null,
                },
              }}
            />
          </Stack>
        </Stack>

        <Button
          variant="contained"
          fullWidth
            onClick={() => router.push("/members/reset-password")}
        >
            {t("members.profile.reset_password")}
        </Button>
      </Container>
    </AuthContainer>
  );
}
