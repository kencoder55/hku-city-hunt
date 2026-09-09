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

  const response = await axios.get(`/products?${queryString}`);

  return {
    data: response.data.result.data.map(data => {
      return {
        id: data.id,
        coverImage: data.cover_image,
        nameZh: data.name_zh,
        nameEn: data.name_en,
        descriptionZh: data.description_zh,
        descriptionEn: data.description_en,
        stock: data.stock,
        requiredRewards: data.required_rewards,
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

const details = async id => {
  const response = await axios.get(`/products/${id}`);
  const result = response.data.result;
  return {
    id: result.id,
    coverImage: result.cover_image,
    nameZh: result.name_zh,
    nameEn: result.name_en,
    descriptionZh: result.description_zh,
    descriptionEn: result.description_en,
    stock: result.stock,
    requiredRewards: result.required_rewards,
    type: result.type,
    redemptionDateZh: result.redemption_date_zh,
    redemptionDateEn: result.redemption_date_en,
    redemptionLink: result.redemption_link,
    updatedAt: result.updated_at,
    createdAt: result.created_at,
    updatedBy: result.updated_by.username || "",
    createdBy: result.created_by.username || "",
  };
};

const create = async input => {
  const formData = new FormData();

  const data = {
    name_zh: input.nameZh,
    name_en: input.nameEn,
    description_zh: input.descriptionZh,
    description_en: input.descriptionEn,
    stock: input.stock,
    required_rewards: input.requiredRewards,
    type: input.type,
    redemption_date_zh: input.redemptionDateZh,
    redemption_date_en: input.redemptionDateEn,
    redemption_link: input.redemptionLink,
    cover_image: input.coverImage ?? undefined,
  };

  // append data to formData
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  // append file to formData
  if (input.file) {
    formData.append("file", input.file);
  }

  const response = await axios.post(`/products`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.result;
};

const update = async (id, input) => {
  const formData = new FormData();

  let data = {
    name_zh: input.nameZh,
    name_en: input.nameEn,
    description_zh: input.descriptionZh,
    description_en: input.descriptionEn,
    stock: input.stock,
    required_rewards: input.requiredRewards,
    type: input.type,
    redemption_date_zh: input.redemptionDateZh,
    redemption_date_en: input.redemptionDateEn,
    redemption_link: input.redemptionLink,
    cover_image: input.coverImage ?? undefined,
  };

  // append data to formData
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  // append file to formData
  if (input.file) {
    formData.append("file", input.file);
  }

  const response = await axios.patch(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.success;
};

const deleteData = async id => {
  const response = await axios.delete(`/products/${id}`);
  return response.data.success;
};

export const ProductApi = {
  list,
  details,
  create,
  update,
  deleteData,
};
