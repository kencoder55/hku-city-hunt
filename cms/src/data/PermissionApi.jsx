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
      qb.setOr({
        field: filter.field,
        operator: filter.operator,
        value: filter.value,
      });
    });
  }

  const queryString = qb.query();

  const response = await axios.get(`/permissions?${queryString}`);

  return {
    data: response.data.result.data.map((data) => {
      return {
        id: data.id,
        action: data.action,
        module: data.module,
        updatedAt: data.updated_at,
        createdAt: data.created_at,
        updatedBy: data.updated_by.username || "",
        createdBy: data.created_by.username || "",
      };
    }),
    page: response.data.result.page,
    pageCount: response.data.result.pageCount,
    total: response.data.result.total,
  };
};

const details = async (id) => {
  const response = await axios.get(`/permissions/getPermissionDetails/${id}`);
  const result = response.data.result;
  
  return result;
};

const save = async (id, input) => {
  const data = {
    role_id: id,
    permission: input,
  };

  const response = await axios.patch(`permissions/save`, data);

  return response.data.success;
};

export const PermissionApi = {
  list,
  details,
  save,
};
