import axios from "@/helper/AxiosHelper";
import { RequestQueryBuilder } from "@dataui/crud-request";

const list = async (page, pageSize, filters, locale) => {
  const limit = pageSize;
  const currentPage = page || 1;

  const qb = RequestQueryBuilder.create({
    page: currentPage,
    sort: [
      {
        field: "id",
        order: "DESC",
      },
    ],
  });

  if (limit >= 1) {
    qb.setLimit(limit);
  }

  if (filters && filters.length > 0) {
    filters.forEach(filter => {
      qb.setOr({
        field: filter.field,
        operator: filter.operator,
        value: filter.value,
      });
    });
  }

  const queryString = qb.query();

  const response = await axios.get(`/products?${queryString}`, {
    headers: {
      "Accept-Language": locale || "en",
    },
  });

  const result = response.data.result;

  if (!result || !result.data) {
    return {
      data: [],
      page: 1,
      pageCount: 0,
      total: 0,
    };
  }

  return {
    data: result.data.map(product => ({
      id: product.id,
      type: product.type,
      name: product.name,
      description: product.description,
      coverImage: product.cover_image,
      stock: product.stock,
      requiredRewards: product.required_rewards,
      redemptionDate: product.redemption_date,
      redemptionLink: product.redemption_link,
      createdAt: product.created_at,
    })),
    page: result.page,
    pageCount: result.pageCount,
    total: result.total,
  };
};

export const ProductApi = {
  list,
};
