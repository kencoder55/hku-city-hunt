import axios from "../helper/AxiosHelper";
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
      qb.setOr({
        field: filter.field,
        operator: filter.operator,
        value: filter.value,
      });
    });
  }

  const queryString = qb.query();

  const response = await axios.get(`/roles?${queryString}`);

  return {
    data: response.data.result.data.map((data) => {
      return {
        id: data.id,
        name: data.name,
        updatedAt: data.updated_at,
        updatedBy: data.updated_by.username || "",
      };
    }),
    page: response.data.result.page,
    pageCount: response.data.result.pageCount,
    total: response.data.result.total,
  };
};

const details = async (id) => {
  const response = await axios.get(`/roles/${id}`);
  const result = response.data.result;
  return {
    id: result.id,
    name: result.name,
    type: result.type,
    updatedAt: result.updated_at,
    createdAt: result.created_at,
    updatedBy: result.updated_by.username || "",
    createdBy: result.created_by.username || "",
  };
};

const create = async (input) => {
  const data = {
    name: input.name,
    type: input.type || "user",
  };

  const response = await axios.post(`/roles`, data);

  return response.data.result.id;
};

const update = async (id, input) => {
  const data = {
    name: input.name,
  };

  const response = await axios.patch(`/roles/${id}`, data);

  return response.data.success;
};

const deleteData = async (id) => {
  const response = await axios.delete(`/roles/${id}`);
  return response.data.success;
};

export const RoleApi = {
  list,
  details,
  create,
  update,
  deleteData,
};
