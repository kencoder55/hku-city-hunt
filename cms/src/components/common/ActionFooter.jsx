import ReactSwal from "@/helper/AlertHelper";
import { checkPermission } from "@/helper/PermissionHelper";
import { useAppSelector } from "@/lib/hooks";
import { Box, Button, Paper } from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function ActionFooter({
  onSubmit,
  onCancel,
  cancelButton = true,
  submitButton = true,
  disableSaveBtn,
  submitStr = "save",
}) {
  const [haveCreatePermission, setHaveCreatePermission] = useState(false);
  const [haveEditPermission, setHaveEditPermission] = useState(false);
  const currentPage = useAppSelector(state => state.common.page);
  const currentAction = useAppSelector(state => state.common.action);
  const currentUser = useAppSelector(state => state.user);
  const t = useTranslations();

  useEffect(() => {
    const createPermission = checkPermission(currentUser, currentPage, "create");
    setHaveCreatePermission(createPermission);

    const editPermission = checkPermission(currentUser, currentPage, "update");
    setHaveEditPermission(editPermission);
  }, [currentUser, currentPage, currentAction]);

  const handleOnCancel = () => {
    ReactSwal.fire({
      title: t("error.warning"),
      text: t("error.cancel_confirm"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("layout.ok"),
      cancelButtonText: t("layout.cancel"),
    }).then(result => {
      if (result.isConfirmed) {
        onCancel();
      }
    });
  };

  return (
    <Box
      component={Paper}
      sx={{
        position: "fixed",
        right: 0,
        left: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "end",
        zIndex: 1,
        gap: 1,
        py: 1,
        px: 2,
      }}
    >
      {cancelButton && (
        <Button size="large" variant="outlined" onClick={handleOnCancel}>
          {t("layout.cancel")}
        </Button>
      )}
      {submitButton && (haveEditPermission || haveCreatePermission) && (
        <Button disableElevation variant="contained" onClick={onSubmit} disabled={disableSaveBtn}>
          {t(`layout.${submitStr}`)}
        </Button>
      )}
    </Box>
  );
}
