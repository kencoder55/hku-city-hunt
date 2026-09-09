"use client";
import { Link, useRouter } from "@/i18n/navigation";
import palette from "@/styles/theme/palette";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { Box, Drawer, IconButton, List, ListItem, ListItemButton, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import LanguageDropdown from "./LanguageDropdown";
import UserInfoView from "./UserInfoView";
import CreateIcon from "@mui/icons-material/Create";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import RoomIcon from "@mui/icons-material/Room";
import CallIcon from "@mui/icons-material/Call";
import FavoriteIcon from "@mui/icons-material/Favorite";
export default function MenuDrawer({ open, onClose }) {
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();

  const menuItems = [
    { text: t("menu.home"), icon: HomeIcon, path: "/" },
    { text: t("menu.missions"), icon: SportsEsportsIcon, path: "/missions" },
    { text: t("menu.rewards"), icon: EmojiEventsIcon, path: "/rewards" },
    { text: t("menu.events"), icon: CreateIcon, path: "/events" },
    {
      text: t("menu.mission_records"),
      icon: FormatListBulletedIcon,
      path: "/mission-records",
    },
    { text: t("menu.about"), icon: InfoIcon, path: "/about-us" },
    { text: t("menu.wellbeing"), icon: FavoriteIcon, path: "/wellbeing" },
    { text: t("menu.gps_guide"), icon: RoomIcon, path: "/gps-guide" },
    { text: t("menu.qa"), icon: QuestionMarkIcon, path: "/qa" },
    {
      text: t("menu.contact"),
      icon: CallIcon,
      path: "/contact",
    },
  ];

  const handleNavigation = path => {
    router.push(path);
    onClose();
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "transparent",
            // remove box shadow
            boxShadow: "none",
            overflow: "hidden",
          },
        },
      }}
    >
      <Box
        sx={{
          width: 280,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          my: "10%",
          backgroundColor: "background.paper",
          // top rounded corners
          borderTopRightRadius: 24,
          borderBottomRightRadius: 24,
          py: 5,
          overflow: "hidden",
        }}
        role="presentation"
      >
        <Box
          sx={{
            px: 2,
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Link
            href={"/"}
            onClick={() => {
              onClose();
            }}
          >
            <Box
              component={"img"}
              src="/assets/icons/logo.svg"
              sx={{
                width: 120,
                height: "auto",
              }}
            />
          </Link>
          <IconButton onClick={onClose}>
            <Box
              component={"img"}
              src="/assets/icons/close.svg"
              sx={{
                width: 30,
                height: 30,
              }}
            />
          </IconButton>
        </Box>

        <UserInfoView onClose={onClose} />

        <Box
          sx={{
            pl: 2,
            pr: 6,
            py: 2,
          }}
        >
          <Box
            sx={{
              height: "1px",
              width: "100%",
              backgroundColor: palette.primary.main,
            }}
          />
        </Box>

        {/* Menu Items: wrapped with a relative container so we can show gradient overlays */}
        <Box sx={{ position: "relative", display: "flex", flexDirection: "column", minHeight: 0 }}>
          <List
            sx={{
              flex: "1 1 auto",
              minHeight: 0,
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
              pb: 4,
            }}
          >
            {menuItems.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    py: 1.5,
                  }}
                >
                  <Box component={item.icon} sx={{ color: palette.colors.c13, mr: 1 }} />
                  <Typography variant="h6">{item.text}</Typography>
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {/* Bottom gradient to indicate there is more to scroll */}
          <Box
            sx={theme => ({
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 64,
              pointerEvents: "none",
              background: `linear-gradient(to bottom, rgba(0,0,0,0), ${theme.palette.background.paper})`,
            })}
          />

          {/* Top gradient for symmetry (subtle) */}
          <Box
            sx={theme => ({
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: 24,
              pointerEvents: "none",
              background: `linear-gradient(to top, rgba(0,0,0,0), ${theme.palette.background.paper})`,
            })}
          />
        </Box>

        <Box
          sx={{
            pl: 2,
            pr: 6,
            py: 2,
          }}
        >
          <Box
            sx={{
              height: "1px",
              width: "100%",
              backgroundColor: palette.primary.main,
            }}
          />
        </Box>

        <LanguageDropdown />

        <Box
          sx={{
            px: 2,
            display: "flex",
            flexDirection: "column",
            color: palette.colors.c5,
          }}
        >
          <Link href="/terms-and-conditions" onClick={onClose}>
            <Typography
              variant="caption"
              sx={{
                textDecoration: "underline",
              }}
            >
              {t("menu.terms_and_conditions")}
            </Typography>
          </Link>
          <Link
            href={`https://330day-s3-production.s3.ap-east-1.amazonaws.com/documents/privacy-policy-statement-and-disclaimer-${locale}.pdf`}
            onClick={onClose}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Typography
              variant="caption"
              sx={{
                textDecoration: "underline",
              }}
            >
              {t("menu.privacy_policy")}
            </Typography>
          </Link>
        </Box>
      </Box>
    </Drawer>
  );
}
