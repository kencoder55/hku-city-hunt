"use client";
import { Box, Button, Typography } from "@mui/material";
import palette from "@/styles/theme/palette";
import { useRouter } from "@/i18n/navigation";

export default function TestPage() {
  const router = useRouter();

  const handleStartTest = () => {
    localStorage.setItem("site_access", "granted");
    router.push("/");
  };

  const handleCancelTest = () => {
    localStorage.removeItem("site_access");
    router.push("/coming-soon");
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: palette.primary.main,
        color: "white",
        p: 4,
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          maxWidth: "600px",
        }}
      >
        <Typography variant="h2" gutterBottom fontWeight="bold">
          測試頁面
        </Typography>
        <Typography variant="h5" sx={{ mt: 2, mb: 4 }}>
          Test Page
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={handleStartTest}
          sx={{
            mt: 4,
            px: 6,
            py: 2,
            fontSize: "1.2rem",
            backgroundColor: "white",
            color: palette.primary.main,
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
        >
          開始測試 / Start Test
        </Button>

        <Button
          variant="outlined"
          size="large"
          onClick={handleCancelTest}
          sx={{
            mt: 2,
            px: 6,
            py: 2,
            fontSize: "1.2rem",
            borderColor: "white",
            color: "white",
            "&:hover": {
              borderColor: "#f0f0f0",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          取消測試 / Cancel Test
        </Button>
      </Box>
    </Box>
  );
}
