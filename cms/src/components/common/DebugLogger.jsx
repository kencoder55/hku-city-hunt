import { Box } from "@mui/material";
import * as React from "react";

export default function DebugLogger({ title = false, data, hidden = false }) {
  return (
    !hidden && (
      <Box component={"pre"}>
        {!title ? "" : `${title}: `}
        {JSON.stringify(data, null, " ")}
      </Box>
    )
  );
}
