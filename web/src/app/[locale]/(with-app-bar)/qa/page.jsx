"use client";

import ContentCard from "@/components/common/ContentCard";
import palette from "@/styles/theme/palette";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslations } from "next-intl";

function QASection({ title, items }) {
  return (
    <Box sx={{ mb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1.5, color: "#6D5831" }}>
        {title}
      </Typography>
      {items.map(({ question, answer }, idx) => (
        <Accordion key={idx} disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 500 }}>{question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
              {answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

export default function QAPage() {
  const t = useTranslations("qa");

  const sections = [
    {
      title: t("section_journey"),
      items: [
        { question: t("journey.q1.question"), answer: t("journey.q1.answer") },
        { question: t("journey.q2.question"), answer: t("journey.q2.answer") },
        { question: t("journey.q3.question"), answer: t("journey.q3.answer") },
        { question: t("journey.q4.question"), answer: t("journey.q4.answer") },
        { question: t("journey.q5.question"), answer: t("journey.q5.answer") },
      ],
    },
    {
      title: t("section_philosophy"),
      items: [
        {
          question: t("philosophy.q1.question"),
          answer: t("philosophy.q1.answer"),
        },
        {
          question: t("philosophy.q2.question"),
          answer: t("philosophy.q2.answer"),
        },
        {
          question: t("philosophy.q3.question"),
          answer: t("philosophy.q3.answer"),
        },
        {
          question: t("philosophy.q4.question"),
          answer: t("philosophy.q4.answer"),
        },
      ],
    },
    {
      title: t("section_missions"),
      items: [
        {
          question: t("missions.q1.question"),
          answer: t("missions.q1.answer"),
        },
        {
          question: t("missions.q2.question"),
          answer: t("missions.q2.answer"),
        },
        {
          question: t("missions.q3.question"),
          answer: t("missions.q3.answer"),
        },
        {
          question: t("missions.q4.question"),
          answer: t("missions.q4.answer"),
        },
      ],
    },
    {
      title: t("section_gps"),
      items: [
        { question: t("gps.q1.question"), answer: t("gps.q1.answer") },
        { question: t("gps.q2.question"), answer: t("gps.q2.answer") },
        { question: t("gps.q3.question"), answer: t("gps.q3.answer") },
        { question: t("gps.q4.question"), answer: t("gps.q4.answer") },
        { question: t("gps.q5.question"), answer: t("gps.q5.answer") },
      ],
    },
    {
      title: t("section_web"),
      items: [
        { question: t("web.q1.question"), answer: t("web.q1.answer") },
        { question: t("web.q2.question"), answer: t("web.q2.answer") },
        { question: t("web.q3.question"), answer: t("web.q3.answer") },
        { question: t("web.q4.question"), answer: t("web.q4.answer") },
      ],
    },
    {
      title: t("section_rewards"),
      items: [
        {
          question: t("rewards.q1.question"),
          answer: t("rewards.q1.answer"),
        },
        {
          question: t("rewards.q2.question"),
          answer: t("rewards.q2.answer"),
        },
        {
          question: t("rewards.q3.question"),
          answer: t("rewards.q3.answer"),
        },
      ],
    },
    {
      title: t("section_safety"),
      items: [
        { question: t("safety.q1.question"), answer: t("safety.q1.answer") },
        { question: t("safety.q2.question"), answer: t("safety.q2.answer") },
        { question: t("safety.q3.question"), answer: t("safety.q3.answer") },
        { question: t("safety.q4.question"), answer: t("safety.q4.answer") },
      ],
    },
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
      <ContentCard title={t("title")} titleColor="#6D5831">
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {sections.map(section => (
            <QASection key={section.title} {...section} />
          ))}
        </Box>
      </ContentCard>
    </Container>
  );
}
