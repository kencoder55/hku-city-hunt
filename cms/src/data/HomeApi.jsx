import { RequestQueryBuilder } from "@dataui/crud-request";
import axios from "../helper/AxiosHelper";

const bannerList = async (page, pageSize, filters) => {
  const limit = pageSize;
  const currentPage = page || 1;

  const qb = RequestQueryBuilder.create({
    page: currentPage,
    sort: [
      {
        field: "position",
        order: "ASC",
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

  const response = await axios.get(`/home-banners?${queryString}`);

  return {
    data: response.data.result.data.map((data) => {
      return {
        id: data.id,
        titleZh: data.title_zh,
        titleEn: data.title_en,
        subtitleZh: data.subtitle_zh,
        subtitleEn: data.subtitle_en, 
        descriptionZh: data.description_zh,
        descriptionEn: data.description_en,
        image: data.image,
        link: data.link,
        position: data.position,
        isActive: data.is_active,
        updatedAt: data.updated_at,
        updatedBy: data.updated_by.username || "",
      };
    }),
    page: response.data.result.page,
    pageCount: response.data.result.pageCount,
    total: response.data.result.total,
  };
};

const bannerDetails = async (id) => {
  const response = await axios.get(`/home-banners/${id}`);
  const result = response.data.result;
  return {
    id: result.id,
    titleZh: result.title_zh,
    titleEn: result.title_en,
    subtitleZh: result.subtitle_zh,
    subtitleEn: result.subtitle_en,
    descriptionZh: result.description_zh,
    descriptionEn: result.description_en,
    image: result.image,
    link: result.link,
    position: result.position,
    isActive: result.is_active,
    updatedAt: result.updated_at,
    createdAt: result.created_at,
    updatedBy: result.updated_by.username || "",
    createdBy: result.created_by.username || "",
  };
};

export const bannerCreate = async input => {
  const formData = new FormData();

  const data = {
    title_zh: input.titleZh,
    title_en: input.titleEn,
    subtitle_zh: input.subtitleZh,
    subtitle_en: input.subtitleEn,
    description_zh: input.descriptionZh,
    description_en: input.descriptionEn,
    image: input.image ?? undefined,
    link: input.link,
  };

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

  const response = await axios.post(`/home-banners`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.result;
};

export const bannerUpdate = async (id, input) => {
  const formData = new FormData();

  const data = {
    title_zh: input.titleZh,
    title_en: input.titleEn,
    subtitle_zh: input.subtitleZh,
    subtitle_en: input.subtitleEn,
    description_zh: input.descriptionZh,
    description_en: input.descriptionEn,
    image: input.image ?? undefined,
    link: input.link,
  };

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

  const response = await axios.patch(`/home-banners/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.success;
};

const bannerDeleteData = async (id) => {
  const response = await axios.delete(`/home-banners/${id}`);
  return response.data.success;
};

const getHomePage = async () => {
  const response = await axios.get(`/home-settings`);
  const result = response.data.result;
  return {
    banners: result?.banners?.map((data) => {
      return {
        id: data.id,
        titleZh: data.title_zh,
        titleEn: data.title_en,
        subtitleZh: data.subtitle_zh,
        subtitleEn: data.subtitle_en,
        descriptionZh: data.description_zh,
        descriptionEn: data.description_en,
        image: data.image,
        link: data.link,
        position: data.position,
        isActive: data.is_active,
      };
    }),
    collections: result.collections ? result.collections.map((item) => {
      return {
        id: item.collection.id,
        name: item.collection.name_zh,
      }
    }): [],
  };
};

export const updateHomePage = async input => {
  const data = {
    banners: input?.banners?.map((media, index) => {
      return {
        id: media.id,
        position: index,
        is_active: media.isActive,
      };
    }) ?? [],
    collections: input.collections ? input.collections.map((item) => {
      return item.id;
    }) : []
  };

  const response = await axios.patch(`home-settings`, data);
  const success = response.data.success;
  return success;
};

export const HomeApi = {
  bannerList,
  bannerDetails,
  bannerCreate,
  bannerUpdate,
  bannerDeleteData,
  getHomePage,
  updateHomePage,
};
