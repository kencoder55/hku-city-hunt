"use client";

import { useAppDispatch } from "@/lib/hooks";
import { updateMenuOpenState } from "@/lib/reducers/commonSlice";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  IconButton,
  AppBar as MuiAppBar,
  Drawer as MuiDrawer,
  Toolbar,
  Typography,
  styled,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import LanguageDropdown from "./LanguageDropdown";
import NestedMenuList from "./NestedMenuList";
import UserDropdown from "./UserDropdown";

const drawerWidth = 240;

const openedMixin = theme => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = theme => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  // minHeight: 48,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
    zIndex: theme.zIndex.drawer + 1,
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(true);
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const isApp = searchParams.get("isApp");

  const handleDrawerOpen = () => {
    setOpen(true);
    dispatch(updateMenuOpenState(true));
  };

  const handleDrawerClose = () => {
    setOpen(false);
    dispatch(updateMenuOpenState(false));
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        elevation={1}
        position="fixed"
        open={open}
        style={{
          display: isApp ? "none" : "block",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}></Typography>

          <LanguageDropdown />
          <UserDropdown />
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        open={open}
        style={{
          display: isApp ? "none" : "block",
        }}
      >
        <DrawerHeader
          sx={{
            display: isApp ? "none" : "flex",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              maxHeight: 50,
            }}
          >
            <Box
              component={"img"}
              src={"/assets/icons/logo.jpg"}
              sx={{
                maxHeight: 50,
              }}
            />
          </Box>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <NestedMenuList />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
