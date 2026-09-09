"use client";
import { UserApi } from "@/data/UserApi";
import ReactSwal from "@/helper/AlertHelper";
import { getAuthCookieName } from "@/helper/GlobalValueHelper";
import { useAppDispatch } from "@/lib/hooks";
import { updateJwtState, updateUserInfo } from "@/lib/reducers/userSlice";
import { getCookie } from "cookies-next/client";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

const KEY = getAuthCookieName();

const AuthContainer = ({ children }) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const userCookie = getCookie(KEY);

      if (!userCookie) {
        window.location.href = "/login?redirect=" + window.location.pathname;
        return;
      }

      const user = JSON.parse(userCookie);

      const response = await UserApi.details(user.userId);

      dispatch(updateUserInfo(response));
      dispatch(updateJwtState(user.jwt));
    } catch (err) {
      console.error(err);
      ReactSwal.fire({
        title: t("error.title"),
        html: err.message,
        icon: "error",
      });
    }
  };

  return children;
};

export default AuthContainer;
