const Element = {
  styleOverrides: {
    root: {
      borderRadius: "99px",
      backgroundColor: "#FFFFFF",
      "&.MuiInputBase-sizeSmall": {
        "& .MuiSelect-select": {
          padding: "4px 12px",
          display: "flex",
          alignItems: "center",
        },
      },
      "& .MuiSelect-select": {
        padding: "8px 16px",
        display: "flex",
        alignItems: "center",
      },
      "&.MuiInputBase-sizeLarge": {
        "& .MuiSelect-select": {
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
        },
      },
    },
  },
};

export default Element;
