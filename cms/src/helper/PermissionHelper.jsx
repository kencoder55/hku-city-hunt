import ReactSwal from "./AlertHelper";

import { getLandingPageName } from "./GlobalValueHelper";

// role 0 = no any permission
// role 1 = admin
// role 2 = manager
// role 3 = staff

const isAdmin = 1;
// const isManager = 2;
// const isStaff = 3;
// const isTester = 3;

export const checkPermission = (user, page, action) => {
  try {
    if (page == getLandingPageName()) {
      return true;
    }

    if (!user) {
      return false;
    }

    if (!user.permissions || user.permissions.length == 0) {
      return false;
    }
    var permissionList = user.permissions;

    var havePermission = false;

    permissionList.forEach(permission => {
      if (permission.module == page && permission.action.includes(action)) {
        havePermission = true;
        return;
      }
    });

    return havePermission;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const checkPagePermission = (user, page, action, router) => {
  if (page == getLandingPageName()) {
    return;
  }

  if (!checkPermission(user, page, action)) {
    router.push("/");
    ReactSwal.fire({
      title: "Permission Denied",
      html: "You do not have permission to access this page.",
      allowOutsideClick: false,
    });
  }
};
