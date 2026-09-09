"use client";
import { getAuthCookieName } from "@/helper/GlobalValueHelper";
import { deleteCookie } from "cookies-next/client";
import { useEffect, useState } from "react";
import { useIdleTimer } from "react-idle-timer";

export default function IdleTimer() {
  // 30 minutes
  const idleTime = 1000 * 60 * 30;
  const [state, setState] = useState("Active");
  const [count, setCount] = useState(0);

  const onIdle = () => {
    setState("Idle");
  };

  const onActive = () => {
    setState("Active");
  };

  const onAction = e => {
    setCount(count => count + 1);
  };

  const idleTimer = useIdleTimer({
    onIdle,
    onActive,
    onAction,
    timeout: idleTime,
    throttle: 500,
  });

  useEffect(() => {
    if (state === "Idle") {
      const KEY = getAuthCookieName();
      deleteCookie(KEY);
      window.location.href = `/login?redirect=${window.location.pathname}`;
    }
  }, [state]);

  return null;
}
