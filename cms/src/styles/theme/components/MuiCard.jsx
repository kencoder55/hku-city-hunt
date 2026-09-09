import Palette from "../palette.jsx";

const Element = {
  styleOverrides: {
    root: {
      borderRadius: "8px",
      "& .MuiCardHeader-root": {
        // paddingLeft: "2rem",
        // paddingRight: "2rem",
        // paddingTop: "2rem",

        "& .MuiCardHeader-title": {
          margin: "0",
          fontSize: "1.4rem",
          fontWeight: 700,
          lineHeight: 1.35,
        },
      },
      "& .MuiCardContent-root": {
        // paddingLeft: "2rem",
        // paddingRight: "2rem",
      },
      "& .MuiCardActions-root": {
        // paddingLeft: "2rem",
        // paddingRight: "2rem",
        // paddingBottom: "2rem",
      },
    },
  },
};

export default Element;
