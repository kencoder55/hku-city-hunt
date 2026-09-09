import axios from "@/helper/AxiosHelper";
import { RequestQueryBuilder } from "@dataui/crud-request";

const list = async (page, pageSize, filters) => {
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
      qb.setFilter({
        field: filter.field,
        operator: filter.operator,
        value: filter.value,
      });
    });
  }

  const queryString = qb.query();

  const response = await axios.get(`/redemption-records?${queryString}`);
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
    data: result.data.map(record => ({
      id: record.id,
      memberId: record.member_id,
      productId: record.product_id,
      redemptionCodeId: record.redemption_code_id,
      type: record.type,
      remark: record.remark,
      createdAt: record.created_at,
      product: record.product
        ? {
            id: record.product.id,
            nameZh: record.product.name_zh,
            nameEn: record.product.name_en,
            type: record.product.type,
            coverImage: record.product.cover_image,
          }
        : null,
      redemptionCode: record.redemptionCode
        ? {
            id: record.redemptionCode.id,
            code: record.redemptionCode.code,
            type: record.redemptionCode.type,
          }
        : null,
    })),
    page: result.page,
    pageCount: result.pageCount,
    total: result.total,
  };
};

export const RedemptionRecordApi = {
  list,
};
