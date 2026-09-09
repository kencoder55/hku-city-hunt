"use client";
import { MemberApi } from "@/data/MemberApi";
import { getAuthCookieName } from "@/helper/GlobalValueHelper";
import { useAppDispatch } from "@/lib/hooks";
import { updateJwtState, updateUserInfo } from "@/lib/reducers/userSlice";
import { getCookie } from "cookies-next/client";
import { useEffect } from "react";

const KEY = getAuthCookieName();

const OptionalAuthContainer = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const userCookie = getCookie(KEY);

      if (!userCookie) {
        // User is not logged in, but that's okay for this component
        console.log("No user cookie found, user is not logged in");
        return;
      }

      const user = JSON.parse(userCookie);

      const response = await MemberApi.me();

      dispatch(updateUserInfo(response));
      dispatch(updateJwtState(user.jwt));
    } catch (err) {
      console.error("Error loading user info:", err);
      // Don't show error to user, just log it
    }
  };

  return children;
};

export default OptionalAuthContainer;
