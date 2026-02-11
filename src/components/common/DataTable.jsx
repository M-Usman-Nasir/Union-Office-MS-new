import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material'

const DataTable = ({
  columns,
  data,
  loading = false,
  pagination,
  onPageChange,
  onRowsPerPageChange,
  emptyMessage = 'No data available',
  dense = false,
}) => {
  const headerPy = dense ? 0.5 : 1.5
  const cellPy = dense ? 0.5 : 1.25
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align || 'left'} sx={{ fontWeight: 600, py: headerPy }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.length > 0 ? (
              data.map((row, index) => (
                <TableRow
                  key={row.id || index}
                  hover
                  sx={{
                    backgroundColor: (theme) =>
                      index % 2 === 1
                        ? theme.palette.mode === 'dark'
                          ? 'rgba(255,255,255,0.03)'
                          : 'rgba(0,0,0,0.02)'
                        : 'transparent',
                    '&:not(:last-child) td': { borderBottom: 1, borderColor: 'divider' },
                  }}
                >
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align || 'left'} sx={{ py: cellPy }}>
                      {column.render ? column.render(row) : row[column.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && (
        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.page - 1}
          onPageChange={(e, page) => onPageChange(page + 1)}
          rowsPerPage={pagination.limit}
          onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      )}
    </Paper>
  )
}

export default DataTable
