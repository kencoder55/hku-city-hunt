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

  const response = await axios.get(`/contact?${queryString}`);

  return {
    data: response.data.result.data.map((data) => {
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        purpose: data.purpose,
        message: data.message,
        createdAt: data.created_at,
      };
    }),
    page: response.data.result.page,
    pageCount: response.data.result.pageCount,
    total: response.data.result.total,
  };
};

const details = async (id) => {
  const response = await axios.get(`/contact/${id}`);
  const result = response.data.result;
  return {
    id: result.id,
    name: result.name,
    email: result.email,
    phone: result.phone,
    purpose: result.purpose,
    message: result.message,
    createdAt: result.created_at,
  };
};

const create = async (input) => {
  const data = {
    name: input.name,
    email: input.email,
    phone: input.phone,
    purpose: input.purpose,
    message: input.message,
  };

  const response = await axios.post(`/contact`, data);

  return response.data.result.id;
};

const update = async (id, input) => {
  const data = {
    name: input.name,
    email: input.email,
    phone: input.phone,
    purpose: input.purpose,
    message: input.message,
  };

  const response = await axios.patch(`/contact/${id}`, data);

  return response.data.success;
};

const deleteData = async (id) => {
  const response = await axios.delete(`/contact/${id}`);
  return response.data.success;
};

export const ContactApi = {
  list,
  details,
  create,
  update,
  deleteData,
};
