import { Box, Container } from "@mui/material";

export default function AuthLayout({ children }) {
  return (
    <Container
      maxWidth="sm"
      disableGutters
      sx={{
        width: "100vw",
        height: "100vh",
        height: "100dvh",
        backgroundImage: 'url("/assets/images/login-bg-2.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflowX: "hidden",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {children}
    </Container>
  );
}
