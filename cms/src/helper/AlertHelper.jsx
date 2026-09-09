import palette from "@/styles/theme/palette";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const ReactSwal = withReactContent(Swal);

export default ReactSwal.mixin({
  confirmButtonColor: palette.primary.main,
  cancelButtonColor: palette.secondary.main,
  focusCancel: true,
  confirmButtonText: "OK",
  cancelButtonText: "Cancel",
  reverseButtons: true,
});
