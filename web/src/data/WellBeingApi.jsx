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

  const response = await axios.get(`/member-wellbeing?${queryString}`, {
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
    data: result.data.map(wellbeing => ({
      id: wellbeing.id,
      memberId: wellbeing.member_id,
      wellbeingScore: wellbeing.wellbeing_score,
      surveyAnswers: wellbeing.survey_answers,
      createdAt: wellbeing.created_at,
    })),
    page: result.page || 1,
    pageCount: result.pageCount || 0,
    total: result.total || 0,
  };
};

const create = async (data, locale) => {
  const response = await axios.post(
    "/member-wellbeing",
    {
      member_id: data.memberId,
      wellbeing_score: data.wellbeingScore,
      survey_answers: data.surveyAnswers,
    },
    {
      headers: {
        "Accept-Language": locale || "en",
      },
    }
  );

  return response.data.result;
};

const listMy = async (page, pageSize) => {
  const params = new URLSearchParams();
  params.set('page', String(page || 1));
  if (pageSize) params.set('page_size', String(pageSize));

  const response = await axios.get(`/member-wellbeing/my?${params.toString()}`);

  const result = response.data.result;

  if (!result || !result.data) {
    return { data: [], page: 1, pageCount: 0, total: 0 };
  }

  return {
    data: result.data.map(wellbeing => ({
      id: wellbeing.id,
      memberId: wellbeing.member_id,
      wellbeingScore: wellbeing.wellbeing_score,
      surveyAnswers: wellbeing.survey_answers,
      createdAt: wellbeing.created_at,
    })),
    page: result.page || 1,
    pageCount: result.pageCount || 0,
    total: result.total || 0,
  };
};

export const WellBeingApi = {
  list,
  listMy,
  create,
};
