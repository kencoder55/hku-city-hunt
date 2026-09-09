"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

export default function ClarityProvider() {
  useEffect(() => {
    // Initialize Clarity only in production and only once
    if (process.env.NODE_ENV !== "development" && process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID) {
      Clarity.init(process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID);
    }
  }, []);

  return null;
}
