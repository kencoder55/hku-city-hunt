import { ButtonBase, Typography } from "@mui/material";
import ProductStamp from "./ProductStamp";
import RegularStamp from "./RegularStamp";
import { useTranslations } from "next-intl";

export default function StampContent({
  index,
  productList,
  memberRewardList,
  stampColors,
  isProductRedeemed,
  onProductClick,
}) {
  const t = useTranslations("rewards");
  const product = productList.find(p => p.requiredRewards === index + 1);
  const hasStamp = memberRewardList[index];

  const handleEmptyStampClick = () => {
    if (onProductClick) {
      onProductClick({
        type: "empty_stamp",
        index: index + 1,
      });
    }
  };

  if (product) {
    return (
      <ProductStamp
        product={product}
        memberRewardList={memberRewardList}
        isProductRedeemed={isProductRedeemed}
        onProductClick={onProductClick}
      />
    );
  }

  if (hasStamp) {
    return <RegularStamp index={index} stampColors={stampColors} />;
  }

  return (
    <ButtonBase onClick={handleEmptyStampClick} sx={{ width: "100%", height: "100%" }}>
      <Typography variant="h4">{index + 1}</Typography>
    </ButtonBase>
  );
}
