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
  const response = await axios.get(`/members?${queryString}`);
  const result = response.data.result.data;

  return {
    data: result.map(data => {
      return {
        id: data.id,
        avatarId: data.avatar_id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        age: data.age,
        updatedAt: data.updated_at,
        createdAt: data.created_at,
        createdBy: data.created_by?.username || "",
        updatedBy: data.updated_by?.username || "",
      };
    }),
    page: response.data.result.page,
    pageCount: response.data.result.pageCount,
    total: response.data.result.total,
  };
};

const details = async id => {
  const response = await axios.get(`/members/${id}`);
  const result = response.data.result;

  return {
    id: result.id,
    avatarId: result.avatar_id,
    name: result.name,
    email: result.email,
    phone: result.phone,
    gender: result.gender,
    age: result.age,
    updatedAt: result.updated_at,
    createdAt: result.created_at,
    updatedBy: result.updated_by?.username || "",
    createdBy: result.created_by?.username || "",
  };
};

const create = async input => {
  const data = {
    avatar_id: input.avatarId,
    name: input.name,
    email: input.email,
    phone: input.phone,
    age: input.age,
    gender: input.gender,
    password: input.password,
  };

  const response = await axios.post(`/members`, data);

  return response.data.result.id;
};

const update = async (id, input) => {
  const data = {
    avatar_id: input.avatarId,
    name: input.name,
    email: input.email,
    phone: input.phone,
    age: input.age,
    gender: input.gender,
    password: input.password != "" ? input.password : undefined,
  };

  const response = await axios.patch(`/members/${id}`, data);

  return response.data.success;
};

const deleteData = async id => {
  const response = await axios.delete(`/members/${id}`);
  return response.data.success;
};

export const MemberApi = {
  list,
  details,
  create,
  update,
  deleteData,
};
