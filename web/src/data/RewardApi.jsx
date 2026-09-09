import axios from "@/helper/AxiosHelper";

const redeemProduct = async (productId, password) => {
  const data = {
    product_id: productId,
    password: password,
  };

  const response = await axios.post("/rewards/redeem-product", data);

  const success = response.data.success;

  return success;
};

const redeemCoupon = async productId => {
  const data = {
    product_id: productId,
  };

  const response = await axios.post("/rewards/redeem-coupon", data);

  const result = response.data.result;

  return {
    code: result.code,
    product: {
      id: result.product.id,
      type: result.product.type,
      coverImage: result.product.cover_image,
      ...result.product,
    },
  };
};

const redeemCode = async (code, type, locale) => {
  const response = await axios.post(
    "/rewards/redeem-code",
    {
      code,
      type,
    },
    {
      headers: {
        "Accept-Language": locale || "en",
      },
    },
  );

  return response.data.result;
};

export const RewardApi = {
  redeemProduct,
  redeemCoupon,
  redeemCode,
};
