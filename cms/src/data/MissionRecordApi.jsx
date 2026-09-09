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
    join: [
      {
        field: "mission",
      },
      {
        field: "member",
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

  const response = await axios.get(`/mission-records?${queryString}`);

  return {
    data: response.data.result.data.map(data => {
      return {
        id: data.id,
        slug: data.slug,
        missionId: data.mission_id,
        memberId: data.member_id,
        missionName: data.mission?.name_zh || data.mission?.name_en || "-",
        memberName: data.member?.name || "-",
        memberEmail: data.member?.email || "-",
        result: data.result,
        createdAt: data.created_at,
      };
    }),
    total: response.data.result.total,
    page: response.data.result.page,
    pageCount: response.data.result.pageCount,
  };
};

export const MissionRecordApi = {
  list,
};
