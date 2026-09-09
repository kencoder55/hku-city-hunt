"use client";

import PermissionChecker from "@/components/common/PermissionChecker";
import { getRolePageName, getSettingPageName, getUserPageName } from "@/helper/GlobalValueHelper";
import { checkPermission } from "@/helper/PermissionHelper";
import { useAppSelector } from "@/lib/hooks";
import RoleIcon from "@mui/icons-material/AdminPanelSettings";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import UserIcon from "@mui/icons-material/PeopleAlt";
import { Box, Breadcrumbs, ButtonBase, Card, Container, Grid, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";

export default function Setting() {
  const t = useTranslations();
  const router = useRouter();
  const [list, setList] = useState([]);
  const currentUser = useAppSelector(state => state.user);

  useEffect(() => {
    setList([
      {
        icon: <UserIcon color="primary" sx={{ fontSize: 40 }} />,
        name: t("menu.users"),
        url: "/users",
        havePermission: checkPermission(currentUser, getUserPageName(), "view"),
      },
      {
        icon: <RoleIcon color="primary" sx={{ fontSize: 40 }} />,
        name: t("menu.roles"),
        url: "/roles",
        havePermission: checkPermission(currentUser, getRolePageName(), "view"),
      },
    ]);
  }, [currentUser]);

  const goToPage = url => {
    router.push(url);
  };

  return (
    <PermissionChecker page={getSettingPageName()} action={"view"}>
      <Container maxWidth={false}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
          <Typography>{t("menu.settings")}</Typography>
        </Breadcrumbs>
        <Grid container spacing={2}>
          {list.map((item, index) => (
            <Grid
              key={index}
              size={{
                xs: 12,
                md: 6,
              }}
            >
              {item.havePermission && (
                <ButtonBase
                  sx={{
                    width: "100%",
                  }}
                >
                  <Card
                    variant="outlined"
                    onClick={() => goToPage(item.url)}
                    sx={{ p: 3, width: "100%" }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {item.icon}
                      <Box sx={{ flex: 1, textAlign: "left" }}>
                        <Typography variant="h6" sx={{ pl: 2 }}>
                          {item.name}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ pl: 2 }}>
                          {item.description}
                        </Typography>
                      </Box>
                      <ArrowForwardIosIcon />
                    </Box>
                  </Card>
                </ButtonBase>
              )}
            </Grid>
          ))}
        </Grid>
      </Container>
    </PermissionChecker>
  );
}
