"use client";
import { useState, useEffect, useMemo } from "react";
import { Box, ButtonBase, Typography } from "@mui/material";
import palette from "@/styles/theme/palette";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoDialog from "@/components/common/InfoDialog";
import StampContent from "./StampContent";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import moment from "moment";

export default function StampCard({
  viewRef,
  productList,
  memberRewardList,
  redemptionRecordList = [],
}) {
  const t = useTranslations();
  const router = useRouter();
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const maxRequiredRewards = productList.length
    ? Math.max(...productList.map(product => product.requiredRewards))
    : 0;
  const TOTAL_STAMPS = maxRequiredRewards || 30;
  const [dialogInfo, setDialogInfo] = useState({
    confirmText: t("layout.ok"),
    linkText: "",
  });

  // Check if a product has been redeemed
  const isProductRedeemed = productId => {
    if (!redemptionRecordList || redemptionRecordList.length === 0 || !productId) {
      return false;
    }

    return redemptionRecordList.some(record => record.productId === productId);
  };

  // Get the redemption record for a product
  const getRedemptionRecord = productId => {
    if (!redemptionRecordList || redemptionRecordList.length === 0 || !productId) {
      return null;
    }

    return redemptionRecordList.find(record => record.productId === productId) || null;
  };

  const colors = [
    palette.colors.c1,
    palette.colors.c2,
    palette.colors.c3,
    palette.colors.c4,
    palette.colors.c8,
    palette.colors.c9,
    palette.colors.c10,
    palette.colors.c11,
    palette.colors.c12,
    palette.colors.c13,
  ];

  const stampColors = useMemo(
    () =>
      Array.from({ length: TOTAL_STAMPS }, () => colors[Math.floor(Math.random() * colors.length)]),
    [TOTAL_STAMPS],
  );

  // Define stamp positions (percentage) - 10 rows with 3 stamps each, order controls display sequence
  const stampPositions = [
    // Row 1 (left to right: 1, 2, 3)
    { top: 12, left: 25, offsetY: -1, order: 1 },
    { top: 12, left: 50, offsetY: -0.5, order: 2 },
    { top: 12, left: 75, offsetY: -0.5, order: 3 },
    // Row 2 (right to left: 6, 5, 4)
    { top: 18.5, left: 75, offsetY: 0.8, order: 4 },
    { top: 18.5, left: 50, offsetY: 0, order: 5 },
    { top: 18.5, left: 25, offsetY: 1, order: 6 },
    // Row 3 (left to right: 7, 8, 9)
    { top: 27, left: 25, offsetY: 1.5, order: 7 },
    { top: 27, left: 50, offsetY: 0, order: 8 },
    { top: 27, left: 75, offsetY: 1, order: 9 },
    // Row 4 (right to left: 12, 11, 10)
    { top: 36, left: 75, offsetY: -1, order: 10 },
    { top: 36, left: 50, offsetY: 0, order: 11 },
    { top: 36, left: 25, offsetY: -0.2, order: 12 },
    // Row 5 (left to right: 13, 14, 15)
    { top: 44, left: 25, offsetY: -1, order: 13 },
    { top: 44, left: 50, offsetY: 0, order: 14 },
    { top: 44, left: 75, offsetY: -0.6, order: 15 },
    // Row 6 (right to left: 18, 17, 16)
    { top: 51, left: 75, offsetY: 0.5, order: 16 },
    { top: 51, left: 50, offsetY: 0, order: 17 },
    { top: 51, left: 25, offsetY: 0.7, order: 18 },
    // Row 7 (left to right: 19, 20, 21)
    { top: 59, left: 25, offsetY: 1.2, order: 19 },
    { top: 59, left: 50, offsetY: 0, order: 20 },
    { top: 59, left: 75, offsetY: 1, order: 21 },
    // Row 8 (right to left: 24, 23, 22)
    { top: 69, left: 75, offsetY: -1, order: 22 },
    { top: 69, left: 50, offsetY: 0, order: 23 },
    { top: 69, left: 25, offsetY: -0.2, order: 24 },
    // Row 9 (left to right: 25, 26, 27)
    { top: 77, left: 25, offsetY: -0.5, order: 25 },
    { top: 77, left: 50, offsetY: 0, order: 26 },
    { top: 77, left: 75, offsetY: -0.1, order: 27 },
    // Row 10 (right to left: 30, 29, 28)
    { top: 84, left: 75, offsetY: 0, order: 28 },
    { top: 84, left: 50, offsetY: 0, order: 29 },
    { top: 84, left: 25, offsetY: 0.8, order: 30 },
  ];

  // Sort stamp positions by order
  const sortedStampPositions = [...stampPositions].sort((a, b) => a.order - b.order);

  // Listen for background image size changes
  useEffect(() => {
    const updateDimensions = () => {
      if (viewRef?.current) {
        const { width, height } = viewRef.current.getBoundingClientRect();
        setImageDimensions({ width, height });
      }
    };

    // Initialize dimensions
    updateDimensions();

    // Listen for window resize
    window.addEventListener("resize", updateDimensions);

    // Listen for image load completion
    if (viewRef?.current) {
      viewRef.current.addEventListener("load", updateDimensions);
    }

    return () => {
      window.removeEventListener("resize", updateDimensions);
      if (viewRef?.current) {
        viewRef.current.removeEventListener("load", updateDimensions);
      }
    };
  }, [viewRef]);

  const handleProductClick = product => {
    if (!product) return;

    console.log("Product clicked:", product);
    setSelectedProduct(product);

    // Handle empty stamp clicks
    if (product.type === "empty_stamp") {
      setSelectedProduct({
        type: "empty_stamp",
        name: t("rewards.unlock_stamp_title"),
        description: t("rewards.unlock_stamp_message"),
        coverImage: null,
      });
      setDialogInfo({
        confirmText: t("rewards.search_missions"),
        linkText: "",
      });
      setOpenDialog(true);
      return;
    }

    // handle no stock
    if (product.stock !== null && product.stock <= 0) {
      setDialogInfo({
        confirmText: t("rewards.out_of_stock"),
        linkText: t("rewards.view_redemption_location"),
      });
      setOpenDialog(true);
      return;
    }

    // Check if product has been redeemed
    const alreadyRedeemed = isProductRedeemed(product.id);

    // Check if user has enough stamps
    const userStampCount = memberRewardList.length;
    const hasEnoughStamps = userStampCount >= product.requiredRewards;

    if (product.type === "product") {
      const redemptionRecord = alreadyRedeemed ? getRedemptionRecord(product.id) : null;
      setDialogInfo({
        confirmText: !hasEnoughStamps
          ? t("layout.ok")
          : alreadyRedeemed
            ? t("rewards.already_redeemed")
            : t("rewards.redeem_product"),
        linkText: t("rewards.view_redemption_location"),
        remark: redemptionRecord
          ? `${t("rewards.redemption_time")}${moment(redemptionRecord.createdAt).format("YYYY-MM-DD HH:mm")}`
          : null,
      });
    } else if (
      product.type === "mtr500" ||
      product.type === "mtr1000" ||
      product.type === "eslite" ||
      product.type === "thealchemistcafe"
    ) {
      setDialogInfo({
        confirmText: !hasEnoughStamps ? t("layout.ok") : t("rewards.redeem_coupon"),
        linkText: t("rewards.view_redemption_method"),
      });
    } else {
      setDialogInfo({
        confirmText: t("layout.ok"),
        linkText: "",
      });
    }

    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);

    // delay clearing selected product to allow dialog close animation
    setTimeout(() => {
      setSelectedProduct(null);
    }, 100);
  };

  const handleConfirmDialog = () => {
    if (!selectedProduct) return;

    // check if product is out of stock
    if (selectedProduct.stock !== null && selectedProduct.stock <= 0) {
      handleCloseDialog();
      return;
    }

    // Check if product has been redeemed
    const alreadyRedeemed = isProductRedeemed(selectedProduct.id);

    // Check if user has enough stamps
    const userStampCount = memberRewardList.length;
    const hasEnoughStamps = userStampCount >= selectedProduct.requiredRewards;

    if (selectedProduct.type === "product") {
      if (alreadyRedeemed || !hasEnoughStamps) {
        handleCloseDialog();
        return;
      }

      router.push("/rewards/redeem-product?product_id=" + selectedProduct.id);
    } else if (
      selectedProduct.type === "mtr500" ||
      selectedProduct.type === "mtr1000" ||
      selectedProduct.type === "eslite" ||
      selectedProduct.type === "thealchemistcafe"
    ) {
      if (!hasEnoughStamps) {
        handleCloseDialog();
        return;
      }

      router.push("/rewards/redeem-coupon?product_id=" + selectedProduct.id);
    } else if (selectedProduct.type === "empty_stamp") {
      router.push("/missions");
    } else {
      handleCloseDialog();
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${imageDimensions.width}px`,
          height: `${imageDimensions.height}px`,
          zIndex: 2,
        }}
      >
        {imageDimensions.width > 0 &&
          Array.from({ length: TOTAL_STAMPS }).map((_, index) => {
            const position = sortedStampPositions[index];

            if (!position) return null;

            // Calculate pixel position based on actual image dimensions
            const topPx =
              (imageDimensions.height * position.top) / 100 +
              (position.offsetY || 0) * (imageDimensions.height / 100);
            const leftPx = (imageDimensions.width * position.left) / 100;

            return (
              <Box
                key={index}
                sx={{
                  position: "absolute",
                  top: `${topPx}px`,
                  left: `${leftPx}px`,
                  transform: "translate(-50%, -50%)",
                  width: "70px",
                  height: "70px",
                  p: 0.5,
                  backgroundColor: "white",
                  borderRadius: 99,
                  border: `4px solid ${palette.colors.c5}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  textAlign: "center",
                  color: "#B0B0B0",
                }}
              >
                <StampContent
                  index={index}
                  productList={productList}
                  memberRewardList={memberRewardList}
                  stampColors={stampColors}
                  isProductRedeemed={isProductRedeemed}
                  onProductClick={handleProductClick}
                />
              </Box>
            );
          })}
      </Box>

      <InfoDialog
        open={openDialog}
        image={selectedProduct?.coverImage}
        title={selectedProduct?.name}
        message={selectedProduct?.description}
        remark={dialogInfo.remark ?? null}
        linkText={dialogInfo.linkText}
        link={selectedProduct?.redemptionLink}
        onClose={handleCloseDialog}
        confirmText={dialogInfo.confirmText}
        onConfirm={handleConfirmDialog}
      />
    </Box>
  );
}
