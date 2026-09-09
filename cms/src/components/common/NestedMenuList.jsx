import {
  getLandingPageName,
  getMemberPageName,
  getMissionPageName,
  getMissionRecordPageName,
  getProductPageName,
  getRedemptionCodePageName,
  getRedemptionRecordPageName,
  getSettingPageName,
} from "@/helper/GlobalValueHelper";
import { checkPermission } from "@/helper/PermissionHelper";
import { Link, usePathname } from "@/i18n/navigation";
import { useAppSelector } from "@/lib/hooks";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CategoryIcon from "@mui/icons-material/Category";
import LandingIcon from "@mui/icons-material/Celebration";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import RedeemIcon from "@mui/icons-material/Redeem";
import SettingIcon from "@mui/icons-material/Settings";
import MemberIcon from "@mui/icons-material/SmartToy";
import {
  Box,
  Collapse,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
export default function NestedMenuList() {
  const t = useTranslations();
  const menuOpen = useAppSelector(state => state.common.menuOpen);
  const currentUser = useAppSelector(state => state.user);
  const [menuList, setMenuList] = useState([]);
  const pathname = usePathname();

  useEffect(() => {
    if (!currentUser || !currentUser.id) {
      return;
    }

    setMenuList([
      {
        icon: <LandingIcon />,
        name: t("menu.landing"),
        path: "/",
        havePermission: checkPermission(currentUser, getLandingPageName(), "view"),
      },
      {
        icon: <MemberIcon />,
        name: t("menu.members"),
        havePermission: checkPermission(currentUser, getMemberPageName(), "view"),
        path: "/members",
      },
      {
        icon: <CategoryIcon />,
        name: t("menu.products"),
        havePermission: checkPermission(currentUser, getProductPageName(), "view"),
        path: "/products",
      },
      {
        icon: <AssignmentIcon />,
        name: t("menu.missions"),
        havePermission: checkPermission(currentUser, getMissionPageName(), "view"),
        path: "/missions",
      },
      {
        icon: <FormatListBulletedIcon />,
        name: t("menu.mission_records"),
        havePermission: checkPermission(currentUser, getMissionRecordPageName(), "view"),
        path: "/mission-records",
      },
      {
        icon: <RedeemIcon />,
        name: t("menu.redemption_codes"),
        havePermission: checkPermission(currentUser, getRedemptionCodePageName(), "view"),
        path: "/redemption-codes",
      },
      {
        icon: <FormatListBulletedIcon />,
        name: t("menu.redemption_records"),
        havePermission: checkPermission(currentUser, getRedemptionRecordPageName(), "view"),
        path: "/redemption-records",
      },
      {
        icon: <SettingIcon />,
        name: t("menu.settings"),
        path: "/settings",
        havePermission: checkPermission(currentUser, getSettingPageName(), "view"),
      },
    ]);
  }, [currentUser]);

  const handleClick = index => {
    menuList[index].open = !menuList[index].open;
    setMenuList([...menuList]);
  };

  return (
    <Box display={"flex"} flexDirection={"column"} height={"100%"}>
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
          flex: 1,
        }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader sx={{ px: 0 }} component="div" id="nested-list-subheader">
            <Divider></Divider>
          </ListSubheader>
        }
      >
        {menuList.map((list, index) =>
          list.havePermission ? (
            list.sub ? (
              <Box key={index}>
                <ListItemButton
                  dense
                  sx={{
                    px: 2.5,
                  }}
                  onClick={() => handleClick(index)}
                >
                  <ListItemIcon>{list.icon}</ListItemIcon>
                  <ListItemText primary={list.name} />
                  {list.open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItemButton>
                <Collapse in={list.open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {list.sub.map(
                      (sub, subIndex) =>
                        sub.havePermission && (
                          <ListItemButton
                            dense
                            key={`${subIndex}`}
                            component={Link}
                            sx={menuOpen ? { pl: 4 } : {}}
                            to={sub.path}
                          >
                            <ListItemIcon>{sub.icon}</ListItemIcon>
                            <ListItemText primary={sub.name} />
                          </ListItemButton>
                        ),
                    )}
                  </List>
                </Collapse>
              </Box>
            ) : (
              <ListItemButton
                dense
                key={index}
                component={Link}
                to={list.path}
                selected={pathname === list.path}
                sx={{
                  px: 2.5,
                }}
              >
                <ListItemIcon>{list.icon}</ListItemIcon>
                <ListItemText primary={list.name} />
              </ListItemButton>
            )
          ) : null,
        )}
      </List>
      <Typography variant="caption" sx={{ textAlign: "center", p: 1 }} color={"gray"}>
        {t("layout.version")} : {process.env.NEXT_PUBLIC_VERSION}
      </Typography>
    </Box>
  );
}
