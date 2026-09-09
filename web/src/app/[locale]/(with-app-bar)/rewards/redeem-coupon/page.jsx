"use client";
import AuthContainer from "@/components/common/AuthContainer";
import HeaderBanner from "@/components/common/HeaderBanner";
import { RewardApi } from "@/data/RewardApi";
import ReactSwal from "@/helper/AlertHelper";
import { sendConversion } from "@/helper/GAHelper";
import { getTranslationField } from "@/helper/UnitsHelper";
import { useRouter } from "@/i18n/navigation";
import palette from "@/styles/theme/palette";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Box, Button, CircularProgress, Container, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RedeemProduct() {
  const [isLoading, setIsLoading] = useState(true);
  const [couponData, setCouponData] = useState(null);
  const searchParams = useSearchParams();
  const productId = searchParams.get("product_id");
  const t = useTranslations();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
      return;
    }

    if (productId) {
      fetchCouponInfo();
    }
  }, [isMounted, productId]);

  const fetchCouponInfo = async () => {
    if (!productId) {
      ReactSwal.fire({
        icon: "error",
        title: t("error.product.id_required"),
      }).then(() => {
        router.back();
      });
      return;
    }

    setIsLoading(true);

    try {
      const data = await RewardApi.redeemCoupon(parseInt(productId));
      sendConversion("redeem_coupon", { product_id: productId });
      setCouponData(data);
    } catch (error) {
      const errorMessage = error.message || "error.unknown";
      const translatedMessage = t(errorMessage, { defaultValue: null });

      ReactSwal.fire({
        icon: "error",
        title: translatedMessage || errorMessage,
      }).then(() => {
        router.push("/rewards");
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (couponData?.code) {
      navigator.clipboard.writeText(couponData.code);
      ReactSwal.fire({
        icon: "success",
        title: t("rewards.code_copied"),
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <AuthContainer>
      <Container
        maxWidth={false}
        sx={{
          height: "100vh",
          height: "100dvh",
          position: "relative",
          overflowX: "hidden",
          backgroundImage: "url('/assets/images/coupon-bg.png')",
          backgroundPosition: "bottom",
          backgroundSize: "cover",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <HeaderBanner
          title={t("rewards.redeem_product")}
          leftIcon="/assets/icons/dr-dayday.png"
          rightIcon="/assets/icons/trophy.svg"
          backgroundColor="#a3a1ea"
          fullWidth={false}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 4,
            flex: 1,
            py: 4,
          }}
        >
          {isLoading ? (
            <CircularProgress />
          ) : couponData ? (
            <>
              <Box
                sx={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 1,
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 4,
                    width: "100%",
                    textAlign: "center",
                    gap: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="img"
                    src={
                      couponData.product.coverImage ||
                      "/assets/images/default-image-placeholder.svg"
                    }
                    sx={{
                      width: "50%",
                      height: "auto",
                    }}
                  />

                  <Typography
                    variant="h6"
                    sx={{
                      textDecoration: "underline",
                    }}
                  >
                    {couponData.product[getTranslationField("name", locale)]}
                  </Typography>

                  <Typography
                    sx={{
                      whiteSpace: "pre-line",
                      textAlign: "left",
                    }}
                  >
                    {couponData.product?.type == "mtr500" || couponData.product?.type == "mtr1000"
                      ? t("rewards.mtr_description")
                      : couponData.product?.type == "eslite"
                        ? t("rewards.eslite_description")
                        : couponData.product[getTranslationField("description", locale)]}
                  </Typography>

                  {couponData.product?.type !== "eslite" && (
                    <>
                      <Box
                        sx={{
                          border: "2px solid",
                          borderColor: "primary.main",
                          borderRadius: 99,
                          backgroundColor: palette.background.paper,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="h3"
                          sx={{
                            p: 2,
                            fontWeight: "bold",
                            letterSpacing: 2,
                            maxWidth: "100%",
                            overflowWrap: "anywhere",
                          }}
                        >
                          {couponData.code}
                        </Typography>
                      </Box>
                      <Button variant="contained" size="small" onClick={handleCopyCode}>
                        {t("rewards.copy_code")}
                      </Button>
                    </>
                  )}

                  {(couponData.product?.type == "mtr500" ||
                    couponData.product?.type == "mtr1000") && (
                    <Button
                      variant="contained"
                      size="small"
                      endIcon={<OpenInNewIcon />}
                      component="a"
                      href={`https://link.mtrmb.mtr.com.hk/moblink/?promotioncode/?code=${couponData.code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("rewards.open_mtr_mobile_app")}
                    </Button>
                  )}
                </Box>
              </Box>

              <Button variant="contained" onClick={() => router.back()}>
                {t("layout.back")}
              </Button>
            </>
          ) : null}
        </Box>
      </Container>
    </AuthContainer>
  );
}
