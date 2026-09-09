import axios from "@/helper/AxiosHelper";
import { RequestQueryBuilder } from "@dataui/crud-request";

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

  const response = await axios.get(`/mission-records?${queryString}`, {
    headers: {
      "Accept-Language": locale || "en",
    },
  });

  const result = response.data.result;

  if (!result || !result.data) {
    return {
      data: [],
      page: 1,
      pageCount: 0,
      total: 0,
    };
  }

  return {
    data: result.data.map(record => ({
      id: record.id,
      slug: record.slug,
      missionId: record.mission_id,
      memberId: record.member_id,
      rewarded: record.rewarded,
      mission: {
        id: record.mission.id,
        slug: record.mission.slug,
        name: record.mission.name,
        description: record.mission.description,
        type: record.mission.type,
        address: record.mission.address,
        wellnessMessage: record.mission.wellness_message,
      },
      result: record.result,
      rewarded: record.rewarded,
      createdAt: record.created_at,
    })),
    page: result.page || 1,
    pageCount: result.pageCount || 0,
    total: result.total || 0,
  };
};

const getMissionRecordBySlug = async (slug, locale) => {
  const response = await axios.get(`/mission-records/${slug}`, {
    headers: {
      "Accept-Language": locale || "en",
    },
  });

  const result = response.data.result;

  if (!result) {
    return null;
  }

  return {
    id: result.id,
    slug: result.slug,
    missionId: result.mission_id,
    memberId: result.member_id,
    mission: result.mission,
    result: result.result,
    rewarded: result.rewarded,
    createdAt: result.created_at,
  };
};

const listMy = async (page, pageSize, locale) => {
  const params = new URLSearchParams();
  params.set('page', String(page || 1));
  if (pageSize) params.set('page_size', String(pageSize));

  const response = await axios.get(`/mission-records/my?${params.toString()}`, {
    headers: {
      "Accept-Language": locale || "en",
    },
  });

  const result = response.data.result;

  if (!result || !result.data) {
    return { data: [], page: 1, pageCount: 0, total: 0 };
  }

  return {
    data: result.data.map(record => ({
      id: record.id,
      slug: record.slug,
      missionId: record.mission_id,
      memberId: record.member_id,
      rewarded: record.rewarded,
      mission: record.mission
        ? {
            id: record.mission.id,
            slug: record.mission.slug,
            name: record.mission.name,
            description: record.mission.description,
            type: record.mission.type,
            address: record.mission.address,
            wellnessMessage: record.mission.wellness_message,
          }
        : null,
      result: record.result,
      createdAt: record.created_at,
    })),
    page: result.page || 1,
    pageCount: result.pageCount || 0,
    total: result.total || 0,
  };
};

export const MissionRecordApi = {
  list,
  listMy,
  getMissionRecordBySlug,
};
