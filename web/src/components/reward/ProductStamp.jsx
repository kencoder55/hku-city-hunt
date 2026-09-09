import { Box, ButtonBase } from "@mui/material";
import StampIcon from "./StampIcon";

export default function ProductStamp({
  product,
  memberRewardList,
  isProductRedeemed,
  onProductClick,
}) {
  return (
    <ButtonBase
      onClick={() => onProductClick(product)}
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
        borderRadius: 99,
      }}
    >
      <StampIcon
        product={product}
        memberRewardList={memberRewardList}
        isProductRedeemed={isProductRedeemed}
      />
      <Box
        component="img"
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: 99,
        }}
        src={product.coverImage || "/assets/images/default-image-placeholder.svg"}
      />
    </ButtonBase>
  );
}
