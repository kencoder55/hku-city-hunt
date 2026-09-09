import { Box, Container } from "@mui/material";

export default function HtmlRenderer({ html, textAlign = "center", disableGutters = true }) {
  return (
    <Container maxWidth={"lg"} disableGutters={disableGutters}>
      <Box
        textAlign={textAlign}
        component={"div"}
        sx={{
          "& img": {
            maxWidth: "100%",
          },

          "& p": {
            margin: "0.2rem 0"
          },

        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Container>
  );
}
