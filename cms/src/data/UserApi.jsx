import axios from "@/helper/AxiosHelper";
import { RequestQueryBuilder } from "@dataui/crud-request";

const login = async (username, password) => {
  const data = {
    username: username,
    password: password,
  };

  const response = await axios.post("users/login", data);
  return response;
};

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
  const response = await axios.get(`/users?${queryString}`);
  const result = response.data.result.data;

  return {
    data: result.map(data => {
      return {
        id: data.id,
        username: data.username,
        email: data.email,
        roles: data.roles,
        updatedAt: data.updated_at,
        createdAt: data.created_at,
        createdBy: data.created_by.username || "",
        updatedBy: data.updated_by.username || "",
      };
    }),
    page: response.data.result.page,
    pageCount: response.data.result.pageCount,
    total: response.data.result.total,
  };
};

const details = async id => {
  const response = await axios.get(`/users/${id}`);
  const result = response.data.result;

  return {
    id: result.id,
    username: result.username,
    email: result.email,
    roles: result.roles,
    permissions: result.permissions
      ? result.permissions.map(p => ({
          id: p.id,
          module: p.module,
          action: p.action,
        }))
      : [],
    updatedAt: result.updated_at,
    createdAt: result.created_at,
    updatedBy: result.updated_by.username || "",
    createdBy: result.created_by.username || "",
  };
};

const create = async input => {
  const data = {
    username: input.username,
    email: input.email,
    password: input.password,
    roles: input.roles ? input.roles.map(role => role.value) : null,
  };

  const response = await axios.post(`/users`, data);

  return response.data.result.id;
};

const update = async (id, input) => {
  const data = {
    username: input.username,
    email: input.email,
    password: input.password != "" ? input.password : undefined,
    roles: input.roles ? input.roles.map(role => role.value) : null,
  };

  const response = await axios.patch(`/users/${id}`, data);

  return response.data.success;
};

const deleteData = async id => {
  const response = await axios.delete(`/users/${id}`);
  return response.data.success;
};

export const UserApi = {
  login,
  list,
  details,
  create,
  update,
  deleteData,
};
