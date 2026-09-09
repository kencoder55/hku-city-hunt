"use client";
import { getAuthCookieName } from "@/helper/GlobalValueHelper";
import { Link, useRouter } from "@/i18n/navigation";
import palette from "@/styles/theme/palette";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { deleteCookie, getCookie } from "cookies-next/client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import MenuDrawer from "./MenuDrawer";

export default function AppLayout({ children }) {
  const [open, setOpen] = useState(false);
  const [member, setMember] = useState(null);
  const router = useRouter();
  const t = useTranslations();
  const KEY = getAuthCookieName();
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    initialMember();
  }, []);

  const initialMember = () => {
    try {
      const userCookie = getCookie(KEY);

      if (userCookie) {
        const cookieMember = JSON.parse(userCookie);

        setMember(cookieMember);
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = isOpen => {
    setOpen(isOpen);
  };

  const logout = () => {
    deleteCookie(KEY);
    setMember(null);
    router.push("/");
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        height: "100dvh",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <Container
        maxWidth="sm"
        disableGutters
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          height: "100dvh",
          overflow: "hidden",
          backgroundColor: palette.background.default,
          position: "relative",
          overflowX: "hidden",
        }}
      >
        <AppBar position="sticky">
          <Toolbar
            sx={{
              position: "relative",
            }}
          >
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => toggleDrawer(true)}
            >
              <Box
                component={"img"}
                src="/assets/icons/nav.svg"
                sx={{
                  width: 30,
                  height: 30,
                }}
              />
            </IconButton>
            <Box flex={1} />

            <Box
              sx={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                height: "100%",
                py: 1,
              }}
            >
              <Link href={"/"}>
                <Box
                  component={"img"}
                  src="/assets/icons/logo.svg"
                  sx={{ height: "100%", width: "auto" }}
                />
              </Link>
            </Box>

            {!member?.id ? (
              <IconButton
                variant="contained"
                size="small"
                onClick={() => router.push("/members/login")}
              >
                <AccountCircleIcon sx={{ width: 40, height: 40 }} />
              </IconButton>
            ) : (
              <Box>
                <IconButton
                  color="inherit"
                  onClick={handleMenu}
                  sx={{
                    p: 0.5,
                    backgroundColor: palette.colors.c10,
                  }}
                >
                  <Box
                    component={"img"}
                    sx={{
                      width: 32,
                      height: 32,
                    }}
                    src={`/assets/icons/avatar/${member.avatarId || 1}.png`}
                  />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem component={Link} href={`/members/profile`} onClick={handleClose}>
                    <Typography>{t("layout.profile")}</Typography>
                  </MenuItem>
                  <MenuItem onClick={logout}>
                    <Typography>{t("layout.logout")}</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Toolbar>
        </AppBar>

        <MenuDrawer open={open} onClose={() => toggleDrawer(false)} />

        <Box
          component={"div"}
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {children}
        </Box>
      </Container>
    </Box>
  );
}
