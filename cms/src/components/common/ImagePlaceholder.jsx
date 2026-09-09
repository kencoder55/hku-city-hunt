"use client";

import { Box } from "@mui/material";
import { useEffect, useState } from "react";

export default function ImagePlaceholder({ url, styleProps }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setStatus("loaded");
    };
    img.onerror = () => {
      setStatus("error");
    };
  }, []);

  if (status === "loading" || status === "error") {
    return (
      <Box component={"img"} src={"/assets/images/product_placeholder.jpg"} sx={styleProps}></Box>
    );
  }

  if (status === "loaded") {
    return <Box component={"img"} src={url} sx={styleProps}></Box>;
  }

  return null;
}
