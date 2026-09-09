import { Button } from "@mui/material";
import { useTranslations } from "next-intl";
import ReactSwal from "../../helper/AlertHelper";

export default function ForgotPassword() {
  const t = useTranslations();

  const showMessage = () => {
    ReactSwal.fire({
      // title: t("error.warning"),
      text: t("error.please_contact_admin"),
      icon: "info",
      // showCancelButton: true,
      confirmButtonText: t("layout.ok"),
      // cancelButtonText: t("layout.cancel"),
    }).then(result => {
      if (result.isConfirmed) {
      }
    });
  };

  return (
    <Button
      variant="text"
      sx={{ mt: 2 }}
      onClick={() => {
        showMessage();
      }}
    >
      {t("layout.forgot_password")}
    </Button>
  );
}
