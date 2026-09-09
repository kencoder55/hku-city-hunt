"use client";

import DebugLogger from "@/components/common/DebugLogger";
import PermissionChecker from "@/components/common/PermissionChecker";
import TableSkeleton from "@/components/common/TableSkeleton";
import { UserApi } from "@/data/UserApi";
import ReactSwal from "@/helper/AlertHelper";
import { getUserPageName } from "@/helper/GlobalValueHelper";
import { checkPermission } from "@/helper/PermissionHelper";
import { useAppSelector } from "@/lib/hooks";
import { CondOperator } from "@dataui/crud-request";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  IconButton,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function List() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [colSpan, setColSpan] = useState(5);
  const [haveCreatePermission, setHaveCreatePermission] = useState(false);
  const [haveUpdatePermission, setHaveUpdatePermission] = useState(false);
  const currentUser = useAppSelector(state => state.user);
  const currentPage = useAppSelector(state => state.common.page);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState([]);
  const [searchStr, setSearchStr] = useState("");
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (searchParams.get("page")) {
      setPage(parseInt(searchParams.get("page")));
    }

    if (!isMounted) {
      setIsMounted(true);
      return;
    }
  }, [isMounted, searchParams]);

  useEffect(() => {
    if (!isMounted) return;

    fetchData();
  }, [isMounted, page, filters]);

  useEffect(() => {
    const createPermission = checkPermission(currentUser, currentPage, "create");
    setHaveCreatePermission(createPermission);

    const updatePermission = checkPermission(currentUser, currentPage, "update");
    setHaveUpdatePermission(updatePermission);
  }, [currentUser, currentPage]);

  useEffect(() => {
    if (options?.length > 0) {
      fetchData();
    }
  }, [options]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await UserApi.list(page, pageSize, filters);

      if (response.data) {
        setData(response.data);
        setTotal(response.total);
      }
    } catch (error) {
      console.log(error);
      ReactSwal.fire({
        icon: "error",
        html: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const viewDetail = id => {
    router.push(`/users/${id}`);
  };

  const onCreate = () => {
    router.push(`/users/create`);
  };

  const onChangePage = value => {
    setPage(value);
    router.push(`/users?page=${value}`);
  };

  const onChangeSearchField = value => {
    setSearchStr(value);
  };

  const search = () => {
    setPage(1);

    if (searchStr === "") {
      setFilters([]);
      return;
    }

    setFilters([
      {
        field: "username",
        operator: CondOperator.CONTAINS,
        value: searchStr,
      },
    ]);
  };

  const getRoleName = roles => {
    let roleName = "";
    roles.forEach(role => {
      roleName += role.name + ", ";
    });
    return roleName.slice(0, -2);
  };

  return (
    <PermissionChecker page={getUserPageName()} action={"view"}>
      <Container maxWidth="false">
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
          <Link href={"/settings"}>{t("menu.settings")} </Link>
          <Typography color="text.primary">{t("menu.users")}</Typography>
        </Breadcrumbs>
        <Card variant="outlined">
          <CardHeader
            title={t("menu.users")}
            action={
              haveCreatePermission && (
                <Button
                  color="inherit"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={onCreate}
                >
                  {t("user.new_user")}
                </Button>
              )
            }
          />

          <CardContent>
            <DebugLogger title={"Users"} data={data} hidden={true} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                pb: 1,
              }}
            >
              <TextField
                placeholder={t("layout.search_by_username")}
                onChange={event => {
                  onChangeSearchField(event.target.value);
                }}
                size="small"
                onKeyDown={event => {
                  if (event.key == "Enter") {
                    search();
                  }
                }}
                sx={{
                  width: "20%",
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <IconButton
                        edge="end"
                        onClick={() => {
                          search();
                        }}
                      >
                        <SearchIcon />
                      </IconButton>
                    ),
                  },
                }}
              />
            </Box>
            <TableContainer elevation={0} component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell width={"5%"}>{t("layout.id")}</TableCell>
                    <TableCell width={"10%"}>{t("user.username")}</TableCell>
                    <TableCell width={"10%"}>{t("user.email")}</TableCell>
                    <TableCell width={"10%"}>{t("user.role")}</TableCell>
                    <TableCell width={"10%"}>{t("layout.updated_at")}</TableCell>
                  </TableRow>
                </TableHead>
                {isLoading ? (
                  <TableSkeleton row={pageSize} colSpan={colSpan} />
                ) : (
                  <TableBody>
                    {!data.length && (
                      <TableRow>
                        <TableCell colSpan={colSpan} align="center">
                          {t("layout.no_data")}
                        </TableCell>
                      </TableRow>
                    )}
                    {data.map(row => (
                      <TableRow
                        hover
                        key={row.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                        onClick={() =>
                          haveUpdatePermission
                            ? viewDetail(row.id)
                            : toast.error(t("error.no_update_permission"))
                        }
                      >
                        <TableCell component="th" scope="row">
                          {row.id}
                        </TableCell>
                        <TableCell>{row.username}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{getRoleName(row.roles)}</TableCell>
                        <TableCell>{row.updatedAt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </CardContent>

          <CardActions sx={{ justifyContent: "space-between", px: 2 }}>
            <Typography variant="body2">
              {t("layout.total")}: {total}
            </Typography>
            <Stack spacing={2}>
              <Pagination
                page={page}
                count={Math.ceil(total / pageSize)}
                shape="rounded"
                onChange={(event, value) => {
                  onChangePage(value);
                }}
              />
            </Stack>
          </CardActions>
        </Card>
      </Container>
    </PermissionChecker>
  );
}
