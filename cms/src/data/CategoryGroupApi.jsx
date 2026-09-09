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

  const response = await axios.get(`/category-groups?${queryString}`);

  return {
    data: response.data.result.data.map((data) => {
      return {
        id: data.id,
        nameZh: data.name_zh,
        nameEn: data.name_en,
        categoryIds: data?.category_ids?.map((item) => {
          return {
            id: item.id,
            nameZh: item.name_zh,
            nameEn: item.name_en,
          };
        }) || [],
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
  const response = await axios.get(`/category-groups/${id}`);
  const result = response.data.result;
  return {
    id: result.id,
    nameZh: result.name_zh,
    nameEn: result.name_en,
    categoryIds: result?.category_ids?.map((item) => {
      return {
        id: item.id,
        name: item.name_zh,
      };
    }) || [],
    updatedAt: result.updated_at,
    createdAt: result.created_at,
    updatedBy: result.updated_by.username || "",
    createdBy: result.created_by.username || "",
  };
};

const create = async (input) => {
  const data = {
    name_zh: input.nameZh,
    name_en: input.nameEn,
    category_ids: input.categoryIds ? input.categoryIds.map((item) => item.id) : [],
  };

  const response = await axios.post(`/category-groups`, data);

  return response.data.result.id;
};

const update = async (id, input) => {
  const data = {
    name_zh: input.nameZh,
    name_en: input.nameEn,
    category_ids: input.categoryIds ? input.categoryIds.map((item) => item.id) : [],
  };

  const response = await axios.patch(`/category-groups/${id}`, data);

  return response.data.success;
};

const deleteData = async (id) => {
  const response = await axios.delete(`/category-groups/${id}`);
  return response.data.success;
};

export const CategoryGroupApi = {
  list,
  details,
  create,
  update,
  deleteData,
};
