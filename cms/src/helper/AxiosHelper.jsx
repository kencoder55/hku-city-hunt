import _axios from "axios";
import { deleteCookie, getCookie } from "cookies-next/client";
import { getAuthCookieName } from "./GlobalValueHelper";

const KEY = getAuthCookieName();

function getToken() {
  try {
    const userCookie = getCookie(KEY);

    if (userCookie) {
      const user = JSON.parse(userCookie);

      return user.jwt;
    }
  } catch (error) {
    console.log(error);
    return "";
  }
}

const axios = () => {
  const token = getToken();
  const instance = _axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_SERVER,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    timeout: 5 * 60 * 1000, // 5 minutes
  });

  instance.interceptors.response.use(
    function (response) {
      if (!response.data.success) {
        return Promise.reject({
          ...response,
          message: response.data.message || "Unknown error",
        });
      }
      return response;
    },
    function (error) {
      console.log(error);
      const statusCode = error?.response?.status;

      if (statusCode === 401 || statusCode === 403) {
        if (typeof window === "undefined") return;

        deleteCookie(KEY);
        window.location.href = `/login?redirect=${window.location.pathname}`;
      }

      return Promise.reject({
        ...error,
        message: error?.response?.data?.message || error?.message || "Unknown error",
      });
    },
  );

  return instance;
};

export default axios();
