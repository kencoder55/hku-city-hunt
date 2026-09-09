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

  const response = await axios.get(`/missions?${queryString}`);

  return {
    data: response.data.result.data.map(data => {
      return {
        id: data.id,
        slug: data.slug,
        nameZh: data.name_zh,
        nameEn: data.name_en,
        type: data.type,
        descriptionZh: data.description_zh,
        descriptionEn: data.description_en,
        coverImage: data.cover_image,
        startTime: data.start_time,
        endTime: data.end_time,
        category: data.category,
        location: data.location,
        parameter: data.parameter,
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
  const response = await axios.get(`/missions/${id}`);
  const result = response.data.result;
  return {
    id: result.id,
    slug: result.slug,
    nameZh: result.name_zh,
    nameEn: result.name_en,
    type: result.type,
    descriptionZh: result.description_zh,
    descriptionEn: result.description_en,
    coverImage: result.cover_image,
    startTime: result.start_time,
    endTime: result.end_time,
    category: result.category,
    location: result.location,
    parameter: result.parameter,
    updatedAt: result.updated_at,
    createdAt: result.created_at,
    updatedBy: result.updated_by?.username || "",
    createdBy: result.created_by?.username || "",
  };
};

const create = async input => {
  const data = {
    slug: input.slug,
    name_zh: input.nameZh,
    name_en: input.nameEn,
    type: input.type,
    description_zh: input.descriptionZh,
    description_en: input.descriptionEn,
    cover_image: input.coverImage,
    start_time: input.startTime,
    end_time: input.endTime,
    category: input.category,
    location: JSON.stringify(input.location),
    parameter: JSON.stringify(input.parameter),
  };

  const response = await axios.post(`/missions`, data);

  return response.data.result;
};

const update = async (id, input) => {
  let data = {
    slug: input.slug,
    name_zh: input.nameZh,
    name_en: input.nameEn,
    type: input.type,
    description_zh: input.descriptionZh,
    description_en: input.descriptionEn,
    cover_image: input.coverImage,
    start_time: input.startTime,
    end_time: input.endTime,
    category: input.category,
    location: JSON.stringify(input.location),
    parameter: JSON.stringify(input.parameter),
  };

  const response = await axios.patch(`/missions/${id}`, data);

  return response.data.success;
};

const deleteData = async id => {
  const response = await axios.delete(`/missions/${id}`);
  return response.data.success;
};

const clearCache = async (action = "missions", slug = null) => {
  const response = await axios.post(`/missions/revalidate`, { action, slug });
  return response.data;
};

export const MissionApi = {
  list,
  details,
  create,
  update,
  deleteData,
  clearCache,
};
