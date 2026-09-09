import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

export default function TableSkeleton({ row, colSpan }) {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={colSpan}>
          {Array.from(new Array(row)).map((item, index) => (
            <Box key={index} sx={{ my: 1 }}>
              <Skeleton height={40} animation="wave" />
            </Box>
          ))}
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
