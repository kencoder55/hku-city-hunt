import { Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function StampIcon({ product, memberRewardList, isProductRedeemed }) {
  const productIndex = product.requiredRewards - 1;
  const hasUnlocked = memberRewardList[productIndex];
  const isRedeemed = isProductRedeemed(product.id);

  if (!hasUnlocked) return null;

  if (isRedeemed) {
    return (
      <CheckCircleIcon
        sx={{
          position: "absolute",
          top: -8,
          right: -8,
          backgroundColor: "white",
          borderRadius: 99,
          color: "#82D98E",
        }}
      />
    );
  }

  return (
    <Box
      component="img"
      src="/assets/icons/gift-box.svg"
      sx={{
        position: "absolute",
        top: -8,
        right: -8,
        width: 28,
        height: 28,
        backgroundColor: "white",
        borderRadius: 99,
        p: 0.3,
      }}
    />
  );
}
