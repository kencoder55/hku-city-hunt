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

  const response = await axios.get(`/collections?${queryString}`);

  return {
    data: response.data.result.data.map((data) => {
      return {
        id: data.id,
        image: data.image,
        nameZh: data.name_zh,
        nameEn: data.name_en,
        slug: data.slug,
        categoryGroupIds: data?.category_group_ids?.map((item) => {
          return {
            id: item.id,
            nameZh: item.name_zh,
            nameEn: item.name_en,
          };
        }) || [],
        type: data.type,
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
  const response = await axios.get(`/collections/${id}`);
  const result = response.data.result;
  return {
    id: result.id,
    image: result.image,
    nameZh: result.name_zh,
    nameEn: result.name_en,
    slug: result.slug,
    categoryGroupIds: result?.category_group_ids?.map((item) => {
      return {
        id: item.id,
        name: item.name_zh,
      };
    }) || [],
    type: result.type,
    updatedAt: result.updated_at,
    createdAt: result.created_at,
    updatedBy: result.updated_by.username || "",
    createdBy: result.created_by.username || "",
  };
};

const create = async (input) => {
  const formData = new FormData();

  const data = {
    image: input.image ?? undefined,
    name_zh: input.nameZh,
    name_en: input.nameEn,
    slug: input.slug,
    category_group_ids_json: input.categoryGroupIds ? input.categoryGroupIds.map((item) => item.id) : [],
    type: input.type,
  };

  data.category_group_ids_json = JSON.stringify(data.category_group_ids_json);

  // append data to formData
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value);
    }
  });

  // append files to formData
  if (input.files && input.files.length > 0) {
    input.files.forEach((file) => {
      formData.append("files", file);
    });
  }

  const response = await axios.post(`/collections`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.result;
};

const update = async (id, input) => {
  const formData = new FormData();

  let data = {
    image: input.image ?? undefined,
    name_zh: input.nameZh,
    name_en: input.nameEn,
    slug: input.slug,
    category_group_ids_json: input.categoryGroupIds ? input.categoryGroupIds.map((item) => item.id) : [],
    type: input.type,
  };

  data.category_group_ids_json = JSON.stringify(data.category_group_ids_json);

  // append data to formData
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value);
    }
  });

  // append files to formData
  if (input.files && input.files.length > 0) {
    input.files.forEach((file) => {
      formData.append("files", file);
    });
  }

  const response = await axios.patch(`/collections/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.success;
};

const deleteData = async (id) => {
  const response = await axios.delete(`/collections/${id}`);
  return response.data.success;
};

export const CollectionApi = {
  list,
  details,
  create,
  update,
  deleteData,
};
