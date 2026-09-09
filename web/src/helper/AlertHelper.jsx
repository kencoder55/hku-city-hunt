import palette from "@/styles/theme/palette";
import typography from "@/styles/theme/typography";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const ReactSwal = withReactContent(Swal);

export default ReactSwal.mixin({
  confirmButtonColor: palette.primary.main,
  cancelButtonColor: palette.secondary.main,
  confirmButtonText: "OK",
  cancelButtonText: "Cancel",
  reverseButtons: true,
  focusConfirm: false,
  focusDeny: false,
  focusCancel: false,
  customClass: {
    confirmButton: "swal2-confirm-custom",
    cancelButton: "swal2-cancel-custom",
    htmlContainer: "swal2-html-custom",
  },
  didOpen: () => {
    // Apply MUI Button styles to SweetAlert2 buttons
    const style = document.createElement("style");
    style.innerHTML = `
      .swal2-confirm-custom,
      .swal2-cancel-custom {
        border-radius: 64px !important;
        text-transform: none !important;
        box-shadow: none !important;
        font-family: ${typography.fontFamily} !important;
        font-size: ${typography.button.fontSize} !important;
        font-weight: ${typography.button.fontWeight} !important;
        line-height: ${typography.button.lineHeight} !important;
        padding: 8px 24px !important;
        margin: 0 8px !important;
      }
      
      .swal2-html-custom {
        white-space: pre-line !important;
      }
      
      .swal2-confirm-custom {
        background-color: ${palette.primary.main} !important;
        border: 2px solid ${palette.primary.main} !important;
        box-shadow: inset 0 0 0 2px white !important;
        color: ${palette.primary.contrastText} !important;
      }
      
      // .swal2-confirm-custom:hover {
      //   background-color: ${palette.primary.light} !important;
      //   border: 2px solid ${palette.primary.light} !important;
      //   box-shadow: inset 0 0 0 2px white !important;
      // }
      
      // .swal2-confirm-custom:focus {
      //   background-color: ${palette.primary.dark} !important;
      //   border: 2px solid ${palette.primary.dark} !important;
      //   box-shadow: inset 0 0 0 2px white !important;
      // }
      
      .swal2-cancel-custom {
        border: 2px solid ${palette.primary.main} !important;
        background-color: #F6F6F6 !important;
        color: ${palette.primary.main} !important;
        outline: 2px solid ${palette.primary.main} !important;
        outline-offset: -6px !important;
      }
      
      // .swal2-cancel-custom:hover {
      //   background-color: ${palette.primary.light} !important;
      //   color: ${palette.primary.contrastText} !important;
      // }
      
    //   .swal2-cancel-custom:focus {
    //     background-color: ${palette.primary.dark} !important;
    //     color: ${palette.primary.contrastText} !important;
    //   }
    `;
    document.head.appendChild(style);
  },
});
