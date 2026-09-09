"use client";

import { usePathname } from "@/i18n/navigation";
import LanguageIcon from "@mui/icons-material/Language";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function LanguageDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState(null);
  const [languageList] = useState([
    { name: "English", value: "en" },
    { name: "繁體中文", value: "zh-HK" },
  ]);
  const open = Boolean(anchorEl);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const switchLang = newLocale => {
    console.log("Switching language to:", pathname, newLocale);
    router.push(`/${newLocale}${pathname}`);
    handleClose();
  };

  return (
    <Box component={"div"}>
      <IconButton
        size="large"
        aria-label="switch language"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleClick}
        color="inherit"
      >
        <LanguageIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        keepMounted
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {languageList.map(lang => (
          <MenuItem key={lang.value} onClick={() => switchLang(lang.value)}>
            {lang.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
