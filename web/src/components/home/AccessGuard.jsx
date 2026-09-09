"use client";
import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";

export default function AccessGuard({ children }) {
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const access = localStorage.getItem("site_access");
    if (access === "granted") {
      setHasAccess(true);
      setIsLoading(false);
    } else {
      router.push("/coming-soon");
    }
  }, [router]);

  if (isLoading || !hasAccess) {
    return null;
  }

  return children;
}
