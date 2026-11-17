import { RequestQueryBuilder } from "@dataui/crud-request";

const fetchPublic = async (url, options = {}) => {
  const baseURL = process.env.NEXT_PUBLIC_API_SERVER;

  const response = await fetch(`${baseURL}${url}`, {
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Unknown error");
  }

  return data;
};

const list = async (page, pageSize, filters, locale) => {
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

  const data = await fetchPublic(`/missions?${queryString}`, {
    headers: {
      "Accept-Language": locale || "en",
    },
    next: {
      // revalidate: 3600, // revalidate cache every 60 minutes
      noStore: true,
      tags: ["missions"],
    },
  });

  const result = data.result;

  if (!result || !result.data) {
    return {
      data: [],
      page: 1,
      pageCount: 0,
      total: 0,
    };
  }

  return {
    data: result.data.map(mission => ({
      id: mission.id,
      slug: mission.slug,
      code: mission.code,
      name: mission.name,
      type: mission.type,
      description: mission.description,
      wellnessMessage: mission.wellness_message,
      address: mission.address,
      coverImage: mission.cover_image,
      startTime: mission.start_time,
      endTime: mission.end_time,
      category: mission.category,
      location: mission.location.map(loc => ({
        brand: loc.brand,
        code: loc.code,
        nameZh: loc.name_zh,
        nameEn: loc.name_en,
        addressZh: loc.address_zh,
        addressEn: loc.address_en,
        maxDistance: loc.max_distance,
        lat: loc.lat,
        lng: loc.lng,
        x: loc.x,
        y: loc.y,
      })),
      parameter: mission.parameter,
    })),
    page: result.page || 1,
    pageCount: result.pageCount || 0,
    total: result.total || 0,
  };
};

const getMissionBySlug = async (slug, locale) => {
  const data = await fetchPublic(`/missions/${slug}`, {
    headers: {
      "Accept-Language": locale || "en",
    },
    next: {
      revalidate: 3600, // revalidate cache every 60 minutes
      tags: ["mission", `mission-${slug}`],
    },
  });

  const result = data.result;

  if (!result) {
    return null;
  }

  return {
    id: result.id,
    slug: result.slug,
    name: result.name,
    type: result.type,
    code: result.code,
    description: result.description,
    wellnessMessage: result.wellness_message,
    address: result.address,
    coverImage: result.cover_image,
    startTime: result.start_time,
    endTime: result.end_time,
    category: result.category,
    location: result.location.map(loc => ({
      brand: loc.brand,
      code: loc.code,
      nameZh: loc.name_zh,
      nameEn: loc.name_en,
      addressZh: loc.address_zh,
      addressEn: loc.address_en,
      maxDistance: loc.max_distance,
      lat: loc.lat,
      lng: loc.lng,
      x: loc.x,
      y: loc.y,
    })),
    parameter: result.parameter,
  };
};

export const MissionPublicApi = {
  list,
  getMissionBySlug,
};
