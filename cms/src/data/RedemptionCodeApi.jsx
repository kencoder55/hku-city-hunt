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

  const response = await axios.get(`/redemption-codes?${queryString}`);

  return {
    data: response.data.result.data.map(data => {
      return {
        id: data.id,
        type: data.type,
        code: data.code,
        isUsed: data.is_used,
        updatedAt: data.updated_at,
        createdAt: data.created_at,
        updatedBy: data.updated_by?.username || "",
        createdBy: data.created_by?.username || "",
      };
    }),
    page: response.data.result.page,
    pageCount: response.data.result.pageCount,
    total: response.data.result.total,
  };
};

const details = async id => {
  const response = await axios.get(`/redemption-codes/${id}`);
  const result = response.data.result;
  return {
    id: result.id,
    type: result.type,
    code: result.code,
    isUsed: result.is_used,
    updatedAt: result.updated_at,
    createdAt: result.created_at,
    updatedBy: result.updated_by?.username || "",
    createdBy: result.created_by?.username || "",
  };
};

const create = async input => {
  const data = {
    type: input.type,
    code: input.code,
    is_used: input.isUsed || false,
  };

  const response = await axios.post(`/redemption-codes`, data);

  return response.data.result;
};

const update = async (id, input) => {
  const data = {
    type: input.type,
    code: input.code,
    is_used: input.isUsed,
  };

  const response = await axios.patch(`/redemption-codes/${id}`, data);

  return response.data.success;
};

const deleteData = async id => {
  const response = await axios.delete(`/redemption-codes/${id}`);
  return response.data.success;
};

export const RedemptionCodeApi = {
  list,
  details,
  create,
  update,
  deleteData,
};
