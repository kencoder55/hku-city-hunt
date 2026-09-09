import { RequestQueryBuilder } from "@dataui/crud-request";
import axios from "../helper/AxiosHelper";

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
    join: [
      {
        field: "member",
      },
      {
        field: "product",
      },
      {
        field: "redemptionCode",
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

  const response = await axios.get(`/redemption-records?${queryString}`);

  return {
    data: response.data.result.data.map(data => {
      return {
        id: data.id,
        memberId: data.member_id,
        productId: data.product_id,
        redemptionCodeId: data.redemption_code_id,
        type: data.type,
        remark: data.remark,
        memberName: data.member?.name || "-",
        memberEmail: data.member?.email || "-",
        productName: data.product?.name_zh || data.product?.name_en || "-",
        productType: data.product?.type || "-",
        redemptionCode: data.redemptionCode?.code || "-",
        redemptionCodeType: data.redemptionCode?.type || "-",
        createdAt: data.created_at,
      };
    }),
    total: response.data.result.total,
    page: response.data.result.page,
    pageCount: response.data.result.pageCount,
  };
};

export const RedemptionRecordApi = {
  list,
};
