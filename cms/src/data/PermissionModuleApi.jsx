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

  const response = await axios.get(`/permission-modules?${queryString}`);

  return {
    data: response.data.result.data.map((data) => {
      return {
        id: data.id,
        module: data.module,
        actions: data.actions,
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
  const response = await axios.get(`/permission-modules/${id}`);
  const result = response.data.result;
  return {
    id: result.id,
    module: result.module,
    actions: result.actions,
    updatedAt: result.updated_at,
    createdAt: result.created_at,
    updatedBy: result.updated_by.username || "",
    createdBy: result.created_by.username || "",
  };
};

const create = async (input) => {
  const data = {
    module: input.module,
    actions: input.actions,
  };

  const response = await axios.post(`/permission-modules`, data);

  return response.data.result.id;
};

const update = async (id, input) => {
  const data = {
    module: input.module,
    actions: input.actions,
  };

  const response = await axios.patch(`/permission-modules/${id}`, data);

  return response.data.success;
};

const deleteData = async (id) => {
  const response = await axios.delete(`/permission-modules/${id}`);
  return response.data.success;
};

const deleteByModule = async (module) => {
  const response = await axios.delete(`/permission-modules/deleteByModule/${module}`);
  return response.data.success;
};

export const PermissionModuleApi = {
  list,
  details,
  create,
  update,
  deleteData,
  deleteByModule,
};
