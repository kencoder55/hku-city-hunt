"use client";
import { checkPagePermission } from "@/helper/PermissionHelper";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateActionState, updatePageState } from "@/lib/reducers/commonSlice";
import { Box } from "@mui/material";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useEffect } from "react";

export default function PermissionChecker({ children, page, action }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const pathname = usePathname();

  useEffect(() => {}, [page, action]);

  useEffect(() => {
    if (!user || !user.id) {
      return;
    }

    if (!page || !action) {
      return;
    }

    dispatch(updatePageState(page));
    dispatch(updateActionState(action));

    checkPagePermission(user, page, action, router);
  }, [pathname, user, page, action]);

  return children;
}
