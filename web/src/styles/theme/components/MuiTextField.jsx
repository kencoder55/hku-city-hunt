const Element = {
  styleOverrides: {
    root: {
      "& .MuiOutlinedInput-root": {
        borderRadius: "99px",
        backgroundColor: "#FFFFFF",
        "&.MuiInputBase-sizeSmall": {
          "& input": {
            padding: "4px 12px",
          },
        },
        "& input": {
          padding: "8px 16px",
        },
        "&.MuiInputBase-sizeLarge": {
          "& input": {
            padding: "12px 20px",
          },
        },
      },
      "& .MuiFilledInput-root": {
        borderRadius: "99px",
        backgroundColor: "#FFFFFF",
        "&.MuiInputBase-sizeSmall": {
          "& input": {
            padding: "4px 12px",
          },
        },
        "& input": {
          padding: "8px 16px",
        },
        "&.MuiInputBase-sizeLarge": {
          "& input": {
            padding: "12px 20px",
          },
        },
      },
    },
  },
  defaultProps: {
    size: "medium",
  },
};

export default Element;
