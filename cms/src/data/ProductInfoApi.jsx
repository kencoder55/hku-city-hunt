import { RequestQueryBuilder } from "@dataui/crud-request";
import axios from "../helper/AxiosHelper";

const list = async (page, pageSize, filters) => {
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
      qb.setFilter({
        field: filter.field,
        operator: filter.operator,
        value: filter.value,
      });
    });
  }

  const queryString = qb.query();

  const response = await axios.get(`/product-info?${queryString}`);

  return {
    data: response.data.result.data.map(data => {
      return {
        id: data.id,
        image: data.image,
        type: data.type,
        productId: data.product_id,
        language: data.language,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
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
  const response = await axios.get(`/product-info/${id}`);
  const result = response.data.result;
  return {
    id: result.id,
    image: result.image,
    type: result.type,
    productId: result.product_id,
    language: result.language,
    createdAt: result.created_at,
    updatedAt: result.updated_at,
    createdBy: result.created_by.username || "",
    updatedBy: result.updated_by.username || "",
  };
};

const create = async input => {
  const formData = new FormData();

  const data = {
    product_id: input.productId,
    language: input.language,
    type: input.type,
    image: input.image ?? undefined,
  };

  // append data to formData
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value);
    }
  });

  // append files to formData
  if (input.files && input.files.length > 0) {
    input.files.forEach(file => {
      formData.append("files", file);
    });
  }

  const response = await axios.post(`/product-info`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.success;
};

const update = async (id, input) => {
  const formData = new FormData();

  let data = {
    image: input.image ?? undefined,
    name_zh: input.nameZh,
    name_en: input.nameEn,
    slug: input.slug,
    description_zh: input.descriptionZh,
    description_en: input.descriptionEn,
    sku: input.sku,
    date_zh: input.dateZh,
    date_en: input.dateEn,
    location_zh: input.locationZh,
    location_en: input.locationEn,
    remark_zh: input.remarkZh,
    remark_en: input.remarkEn,
  };

  // append data to formData
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value);
    }
  });

  // append files to formData
  if (input.files && input.files.length > 0) {
    input.files.forEach(file => {
      formData.append("files", file);
    });
  }

  const response = await axios.patch(`/product-info/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.success;
};

const deleteData = async id => {
  const response = await axios.delete(`/product-info/${id}`);
  return response.data.success;
};

const updatePosition = async productInfoList => {
  const response = await axios.patch(
    `/product-info/update-position`,
    productInfoList.map((item, index) => ({
      id: item.id,
      position: index + 1,
    })),
  );

  return response.data.success;
};

export const ProductInfoApi = {
  list,
  details,
  create,
  update,
  deleteData,
  updatePosition,
};
