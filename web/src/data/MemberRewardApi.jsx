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

  const response = await axios.get(`/member-rewards?${queryString}`);
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
    data: result.data.map(reward => ({
      id: reward.id,
      missionId: reward.mission_id,
      missionRecordId: reward.mission_record_id,
      isUsed: reward.is_used,
      createdAt: reward.created_at,
      mission: reward.mission
        ? {
            id: reward.mission.id,
            nameZh: reward.mission.name_zh,
            nameEn: reward.mission.name_en,
            coverImage: reward.mission.cover_image,
          }
        : null,
    })),
    page: result.page,
    pageCount: result.pageCount,
    total: result.total,
  };
};

export const MemberRewardApi = {
  list,
};
