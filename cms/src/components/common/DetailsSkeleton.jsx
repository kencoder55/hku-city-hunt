import { Box, Card, CardContent, CardHeader, Skeleton } from "@mui/material";

export default function DetailsSkeleton() {
  return (
    <Box>
      <Card variant="outlined">
        <CardHeader
          subheader={<Skeleton height={50} width={"30%"} animation="wave" />}
        ></CardHeader>
        <CardContent>
          <Skeleton height={50} animation="wave" />
          <Skeleton height={50} animation="wave" />
          <Skeleton height={50} animation="wave" />
          <Skeleton height={50} animation="wave" />
          <Skeleton height={50} animation="wave" />
        </CardContent>
      </Card>
      <Box py={2}></Box>
      <Card variant="outlined">
        <CardHeader
          subheader={<Skeleton height={50} width={"30%"} animation="wave" />}
        ></CardHeader>
        <CardContent>
          <Skeleton height={50} animation="wave" />
          <Skeleton height={50} animation="wave" />
        </CardContent>
      </Card>
      <Box py={2}></Box>
      <Card variant="outlined">
        <CardHeader
          subheader={<Skeleton height={50} width={"30%"} animation="wave" />}
        ></CardHeader>
        <CardContent>
          <Skeleton height={50} animation="wave" />
          <Skeleton height={50} animation="wave" />
        </CardContent>
      </Card>
    </Box>
  );
}
