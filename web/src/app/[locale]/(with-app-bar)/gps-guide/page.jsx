"use client";

import {
  Box,
  Typography,
  Alert,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AppleIcon from "@mui/icons-material/Apple";
import AndroidIcon from "@mui/icons-material/Android";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useTranslations } from "next-intl";
import ContentCard from "@/components/common/ContentCard";
import palette from "@/styles/theme/palette";

export default function GpsGuidePage({ params }) {
  const t = useTranslations("gps_guide");

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
          <Alert severity="info">{t("description")}</Alert>

          <Alert severity="error" icon={<WarningAmberIcon />}>
            {t("precise_location_warning")}
          </Alert>

          {/* iOS Section */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <AppleIcon sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h5" component="h2">
                {t("ios.title")}
              </Typography>
            </Box>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{t("ios.method1.title")}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  <ListItem>
                    <ListItemText primary={`1. ${t("ios.method1.step1")}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`2. ${t("ios.method1.step2")}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`3. ${t("ios.method1.step3")}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`4. ${t("ios.method1.step4")}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`5. ${t("ios.method1.step5")}`} />
                  </ListItem>
                </List>
                <Alert severity="error" icon={<WarningAmberIcon />} sx={{ mt: 2 }}>
                  {t("ios.method1.precise_location_note")}
                </Alert>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{t("ios.method2.title")}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  <ListItem>
                    <ListItemText primary={`1. ${t("ios.method2.step1")}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`2. ${t("ios.method2.step2")}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`3. ${t("ios.method2.step3")}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`4. ${t("ios.method2.step4")}`} />
                  </ListItem>
                </List>
                <Alert severity="error" icon={<WarningAmberIcon />} sx={{ mt: 2 }}>
                  {t("ios.method2.precise_location_note")}
                </Alert>
              </AccordionDetails>
            </Accordion>

            <Alert severity="warning" icon={<WarningAmberIcon />} sx={{ mt: 2 }}>
              {t("ios.note")}
            </Alert>
          </Box>

          {/* Android Section */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <AndroidIcon sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h5" component="h2">
                {t("android.title")}
              </Typography>
            </Box>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{t("android.method1.title")}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  <ListItem>
                    <ListItemText primary={`1. ${t("android.method1.step1")}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`2. ${t("android.method1.step2")}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`3. ${t("android.method1.step3")}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`4. ${t("android.method1.step4")}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`5. ${t("android.method1.step5")}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`6. ${t("android.method1.step6")}`} />
                  </ListItem>
                </List>
                <Alert severity="error" icon={<WarningAmberIcon />} sx={{ mt: 2 }}>
                  {t("android.method1.precise_location_note")}
                </Alert>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{t("android.method2.title")}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  <ListItem>
                    <ListItemText primary={`1. ${t("android.method2.step1")}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`2. ${t("android.method2.step2")}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`3. ${t("android.method2.step3")}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`4. ${t("android.method2.step4")}`} />
                  </ListItem>
                </List>
                <Alert severity="error" icon={<WarningAmberIcon />} sx={{ mt: 2 }}>
                  {t("android.method2.precise_location_note")}
                </Alert>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{t("android.method3.title")}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Alert severity="warning" icon={<WarningAmberIcon />} sx={{ mb: 2 }}>
                  {t("android.method3.description")}
                </Alert>
                <List dense>
                  <ListItem>
                    <ListItemText primary={`1. ${t("android.method3.step1")}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`2. ${t("android.method3.step2")}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`3. ${t("android.method3.step3")}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`4. ${t("android.method3.step4")}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`5. ${t("android.method3.step5")}`} />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>

            <Alert severity="warning" icon={<WarningAmberIcon />} sx={{ mt: 2 }}>
              {t("android.note")}
            </Alert>
          </Box>

          {/* Troubleshooting Section */}
          <Box>
            <Typography variant="h5" component="h2" gutterBottom>
              {t("troubleshooting.title")}
            </Typography>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{t("troubleshooting.issue1.title")}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  <ListItem>
                    <ListItemText primary={`• ${t("troubleshooting.issue1.solution1")}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`• ${t("troubleshooting.issue1.solution2")}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`• ${t("troubleshooting.issue1.solution3")}`} />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{t("troubleshooting.issue2.title")}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  <ListItem>
                    <ListItemText primary={`• ${t("troubleshooting.issue2.solution1")}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`• ${t("troubleshooting.issue2.solution2")}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`• ${t("troubleshooting.issue2.solution3")}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`• ${t("troubleshooting.issue2.solution4")}`} />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{t("troubleshooting.issue3.title")}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  <ListItem>
                    <ListItemText primary={`• ${t("troubleshooting.issue3.solution1")}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`• ${t("troubleshooting.issue3.solution2")}`} />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{t("troubleshooting.issue4.title")}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  <ListItem>
                    <ListItemText primary={`• ${t("troubleshooting.issue4.solution1")}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`• ${t("troubleshooting.issue4.solution2")}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`• ${t("troubleshooting.issue4.solution3")}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`• ${t("troubleshooting.issue4.solution4")}`} />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
          </Box>

          {/* FAQ Section */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <HelpOutlineIcon sx={{ mr: 1 }} />
              <Typography variant="h5" component="h2">
                {t("faq.title")}
              </Typography>
            </Box>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{t("faq.q1.question")}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">{t("faq.q1.answer")}</Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{t("faq.q2.question")}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">{t("faq.q2.answer")}</Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{t("faq.q3.question")}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">{t("faq.q3.answer")}</Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{t("faq.q4.question")}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">{t("faq.q4.answer")}</Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      </ContentCard>
    </Container>
  );
}
