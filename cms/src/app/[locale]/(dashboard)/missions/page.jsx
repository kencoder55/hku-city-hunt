"use client";

import PermissionChecker from "@/components/common/PermissionChecker";
import TableSkeleton from "@/components/common/TableSkeleton";
import { MissionApi } from "@/data/MissionApi";
import ReactSwal from "@/helper/AlertHelper";
import { checkPermission } from "@/helper/PermissionHelper";
import { useRouter } from "@/i18n/navigation";
import { useAppSelector } from "@/lib/hooks";
import { CondOperator } from "@dataui/crud-request";
import AddIcon from "@mui/icons-material/Add";
import CachedIcon from "@mui/icons-material/Cached";
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
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function List() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [colSpan, setColSpan] = useState(8);
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
  const [isLoading, setIsLoading] = useState(true);
  const [isClearingCache, setIsClearingCache] = useState(false);
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

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await MissionApi.list(page, pageSize, filters);

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
    router.push(`/missions/${id}`);
  };

  const onCreate = () => {
    router.push("/missions/create");
  };

  const onChangePage = value => {
    setPage(value);
  };

  const onClearCache = async () => {
    try {
      setIsClearingCache(true);
      await MissionApi.clearCache("all");
      toast.success(t("layout.clear_cache_success"));
    } catch (error) {
      console.log(error);
      ReactSwal.fire({
        icon: "error",
        html: error.message,
      });
    } finally {
      setIsClearingCache(false);
    }
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
        field: "name_zh",
        operator: CondOperator.CONTAINS,
        value: searchStr,
      },
      {
        field: "name_en",
        operator: CondOperator.CONTAINS,
        value: searchStr,
      },
      {
        field: "slug",
        operator: CondOperator.CONTAINS,
        value: searchStr,
      },
    ]);
  };

  return (
    <PermissionChecker page={"mission"} action={"view"}>
      <Container maxWidth={false}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
          <Typography color="text.primary">{t("menu.missions")}</Typography>
        </Breadcrumbs>
        <Card variant="outlined">
          <CardHeader
            title={t("menu.missions")}
            action={
              <Stack direction="row" spacing={1}>
                {/* <Button
                  color="inherit"
                  variant="outlined"
                  startIcon={<CachedIcon />}
                  onClick={onClearCache}
                  disabled={isClearingCache}
                >
                  {t("layout.clear_cache")}
                </Button> */}
                {haveCreatePermission && (
                  <Button
                    color="inherit"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={onCreate}
                  >
                    {t("missions.new_mission")}
                  </Button>
                )}
              </Stack>
            }
          />

          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                pb: 1,
              }}
            >
              <TextField
                placeholder={t("layout.search_by_name")}
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
                    <TableCell width={"10%"}>{t("missions.slug")}</TableCell>
                    <TableCell width={"15%"}>{t("missions.name")} (中文)</TableCell>
                    <TableCell width={"15%"}>{t("missions.name")} (English)</TableCell>
                    <TableCell width={"10%"}>{t("missions.type")}</TableCell>
                    <TableCell width={"10%"}>{t("missions.category")}</TableCell>
                    <TableCell width={"15%"}>{t("missions.start_time")}</TableCell>
                    <TableCell width={"15%"}>{t("missions.end_time")}</TableCell>
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
                            : toast.error(t("error.no_permission"))
                        }
                      >
                        <TableCell component="th" scope="row">
                          {row.id}
                        </TableCell>
                        <TableCell>{row.slug}</TableCell>
                        <TableCell>{row.nameZh}</TableCell>
                        <TableCell>{row.nameEn}</TableCell>
                        <TableCell>{row.type}</TableCell>
                        <TableCell>{row.category}</TableCell>
                        <TableCell>{row.startTime}</TableCell>
                        <TableCell>{row.endTime}</TableCell>
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
