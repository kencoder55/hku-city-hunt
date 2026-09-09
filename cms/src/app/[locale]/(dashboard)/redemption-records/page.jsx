"use client";

import PermissionChecker from "@/components/common/PermissionChecker";
import TableSkeleton from "@/components/common/TableSkeleton";
import { RedemptionRecordApi } from "@/data/RedemptionRecordApi";
import ReactSwal from "@/helper/AlertHelper";
import { getRedemptionRecordPageName } from "@/helper/GlobalValueHelper";
import { CondOperator } from "@dataui/crud-request";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Breadcrumbs,
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

export default function List() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const [colSpan, setColSpan] = useState(9);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState([]);
  const [searchStr, setSearchStr] = useState("");
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
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

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await RedemptionRecordApi.list(page, pageSize, filters);

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

  const onChangePage = value => {
    setPage(value);
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
        field: "type",
        operator: CondOperator.CONTAINS,
        value: searchStr,
      },
      {
        field: "member.name",
        operator: CondOperator.CONTAINS,
        value: searchStr,
      },
      {
        field: "member.email",
        operator: CondOperator.CONTAINS,
        value: searchStr,
      },
      {
        field: "product.name_zh",
        operator: CondOperator.CONTAINS,
        value: searchStr,
      },
      {
        field: "product.name_en",
        operator: CondOperator.CONTAINS,
        value: searchStr,
      },
      {
        field: "redemptionCode.code",
        operator: CondOperator.CONTAINS,
        value: searchStr,
      },
    ]);
  };

  return (
    <PermissionChecker page={getRedemptionRecordPageName()} action={"view"}>
      <Container maxWidth={false}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
          <Typography color="text.primary">{t("menu.redemption_records")}</Typography>
        </Breadcrumbs>
        <Card variant="outlined">
          <CardHeader title={t("menu.redemption_records")} />

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
                    <TableCell width={"10%"}>{t("redemption_records.type")}</TableCell>
                    <TableCell width={"12%"}>{t("redemption_records.member_name")}</TableCell>
                    <TableCell width={"12%"}>{t("redemption_records.member_email")}</TableCell>
                    <TableCell width={"12%"}>{t("redemption_records.product_name")}</TableCell>
                    <TableCell width={"10%"}>{t("redemption_records.product_type")}</TableCell>
                    <TableCell width={"12%"}>{t("redemption_records.redemption_code")}</TableCell>
                    <TableCell width={"15%"}>{t("redemption_records.remark")}</TableCell>
                    <TableCell width={"12%"}>{t("layout.created_at")}</TableCell>
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
                        key={row.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.id}
                        </TableCell>
                        <TableCell>{row.type}</TableCell>
                        <TableCell>{row.memberName}</TableCell>
                        <TableCell>{row.memberEmail}</TableCell>
                        <TableCell>{row.productName}</TableCell>
                        <TableCell>{row.productType}</TableCell>
                        <TableCell>{row.redemptionCode}</TableCell>
                        <TableCell>
                          <Typography
                            variant="caption"
                            sx={{
                              maxWidth: "200px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              display: "block",
                            }}
                          >
                            {row.remark || "-"}
                          </Typography>
                        </TableCell>
                        <TableCell>{row.createdAt}</TableCell>
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
