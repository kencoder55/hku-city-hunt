"use client";

import PermissionChecker from "@/components/common/PermissionChecker";
import Wellcome from "@/components/common/Wellcome";
import { getLandingPageName } from "@/helper/GlobalValueHelper";

export default function Home() {
  return (
    <PermissionChecker page={getLandingPageName()} action={"view"}>
      <Wellcome />
    </PermissionChecker>
  );
}
