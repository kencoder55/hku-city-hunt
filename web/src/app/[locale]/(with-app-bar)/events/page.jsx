"use client";

import ContentCard from "@/components/common/ContentCard";
import palette from "@/styles/theme/palette";
import { Box, Button, Container, Divider, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function Events({ params }) {
  const t = useTranslations("events");
  const eventList = [
    { name: t("event1.name"), description: t("event1.description"), link: null },
    {
      name: t("event2.name"),
      description: t("event2.description"),
      link: "https://go.adobe.io/r/iLx2Houi35j",
    },
    {
      name: t("event3.name"),
      description: t("event3.description"),
      link: "https://go.adobe.io/r/iLx2Houi35j",
    },
    {
      name: t("event4.name"),
      description: t("event4.description"),
      link: "https://luma.com/h8ccxkv6",
    },
    {
      name: t("event5.name"),
      description: t("event5.description"),
      link: "https://luma.com/58p7wpaj",
    },
    {
      name: t("event6.name"),
      description: t("event6.description"),
      link: "https://events.teams.microsoft.com/event/c93732af-bcde-4c4a-82cb-78a4df40334a@5d8c60e5-918a-4163-9cb6-05bef4a71fb6",
    },
    { name: t("event7.name"), description: t("event7.description"), link: null },
  ];

  return (
    <Container
      maxWidth={false}
      sx={{
        backgroundColor: palette.colors.c10,
        minHeight: "100%",
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        py: 4,
      }}
    >
      <ContentCard title={t("workshop_signup")} titleColor="#6D5831" borderColor="#C88FBB">
        <Stack spacing={2}>
          {eventList.map((event, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography variant="h5" gutterBottom color="#6D5831">
                {event.name}
              </Typography>
              <Typography variant="body1" gutterBottom sx={{ whiteSpace: "pre-line" }}>
                {event.description}
              </Typography>

              {event.link && (
                <Button
                  variant="contained"
                  color="primary"
                  component="a"
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("register_now")}
                </Button>
              )}
              <Box />
              <Divider flexItem />
            </Box>
          ))}
        </Stack>
      </ContentCard>
    </Container>
  );
}
