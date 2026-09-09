"use client";

import { Box, Button, Typography } from "@mui/material";

export default function Error() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
      gap={2}
      textAlign="center"
      px={3}
    >
      <Typography variant="h1" fontWeight="bold">
        500
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Something went wrong. Please try again later.
      </Typography>
      <Button variant="outlined" onClick={() => window.location.reload()}>
        Try again
      </Button>
    </Box>
  );
}
