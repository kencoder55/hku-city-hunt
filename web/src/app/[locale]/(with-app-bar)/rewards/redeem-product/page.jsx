"use client";
import AuthContainer from "@/components/common/AuthContainer";
import HeaderBanner from "@/components/common/HeaderBanner";
import { RewardApi } from "@/data/RewardApi";
import ReactSwal from "@/helper/AlertHelper";
import { sendConversion } from "@/helper/GAHelper";
import { useRouter } from "@/i18n/navigation";
import { Box, Button, Container, Typography } from "@mui/material";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function RedeemProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const productId = searchParams.get("product_id");
  const t = useTranslations();
  const router = useRouter();
  const [isRedeemed, setIsRedeemed] = useState(false);

  const handleScan = async detectedCodes => {
    if (isLoading) {
      return;
    }

    if (!detectedCodes || detectedCodes.length === 0) {
      return;
    }

    const code = detectedCodes[0];
    const password = code.rawValue;

    if (!password) {
      return;
    }

    if (!productId) {
      ReactSwal.fire({
        icon: "error",
        title: t("error.product.id_required"),
      });
      return;
    }

    setIsLoading(true);

    try {
      await RewardApi.redeemProduct(parseInt(productId), password);

      sendConversion("redeem_product", { product_id: productId });
      setIsRedeemed(true);
      ReactSwal.fire({
        icon: "success",
        title: t("rewards.redeem_success"),
      }).then(() => {
        router.push("/rewards");
      });
    } catch (error) {
      const errorMessage = error.message || "error.unknown";

      // Check if the error message is a translation key
      const translatedMessage = t(errorMessage, { defaultValue: null });

      ReactSwal.fire({
        icon: "error",
        title: translatedMessage || errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer>
      <Container
        maxWidth={false}
        sx={{
          height: "100%",
          position: "relative",
          overflowX: "hidden",
          backgroundImage: "url('/assets/images/product-redeem-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "bottom",
        }}
      >
        <Box>
          <HeaderBanner
            title={t("rewards.redeem_product")}
            leftIcon="/assets/icons/dr-dayday.png"
            rightIcon="/assets/icons/trophy.svg"
            backgroundColor="#a3a1ea"
            fullWidth={false}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "auto",
              aspectRatio: "1 / 1",
              borderRadius: 1,
              overflow: "hidden",
              backgroundColor: "black",
            }}
          >
            <Scanner
              onScan={handleScan}
              paused={isRedeemed}
              scanDelay={2000} // 1 second delay between scans
              components={{
                finder: false,
              }}
              constraints={{
                facingMode: "environment", // Use rear camera
                aspectRatio: 1, // Square aspect ratio
                // Advanced constraints
                width: { ideal: 1920 },
                height: { ideal: 1080 },
                backgroundColor: "black",
              }}
              onError={error => console.error(error)}
            />
          </Box>
          <Typography variant="h5" textAlign="center" color="white" whiteSpace="pre-line">
            {t("rewards.scan_instruction")}
          </Typography>

          <Button variant="contained" onClick={() => router.push("/rewards")}>
            {t("layout.back")}
          </Button>
        </Box>
      </Container>
    </AuthContainer>
  );
}
