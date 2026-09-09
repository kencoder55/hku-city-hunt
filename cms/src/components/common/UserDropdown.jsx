"use client";
import { getAuthCookieName } from "@/helper/GlobalValueHelper";
import { useAppSelector } from "@/lib/hooks";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import { deleteCookie } from "cookies-next/client";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useState } from "react";

export default function UserDropdown() {
  const t = useTranslations();
  const [anchorEl, setAnchorEl] = useState(null);
  const currentUserId = useAppSelector(state => state.user.id);
  const currentUsername = useAppSelector(state => state.user.username);

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    deleteCookie(getAuthCookieName());
    window.location.href = "/login";
    handleClose();
  };

  if (!currentUserId) {
    return null;
  }

  return (
    <Box component={"div"}>
      <Button onClick={handleMenu} color="inherit">
        <AccountCircle />
        {currentUsername}
      </Button>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem component={Link} href={`/users/${currentUserId}`} onClick={handleClose}>
          <Typography>{t("layout.profile")}</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Typography>{t("layout.logout")}</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}
