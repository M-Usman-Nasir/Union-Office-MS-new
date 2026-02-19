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
  getRowSx,
}) => {
  const headerPy = dense ? 0.5 : 1.5
  const cellPy = dense ? 0.5 : 1.25
  const headerPx = dense ? 1 : undefined
  const cellPx = dense ? 1 : undefined
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
      </Box>
    )
  }

  const getCellSx = (column) => {
    const base = { py: cellPy }
    if (cellPx !== undefined) base.px = cellPx
    if (column.minWidth) base.minWidth = column.minWidth
    if (column.width) base.width = column.width
    return base
  }
  const getHeaderSx = (column) => {
    const base = { fontWeight: 600, py: headerPy }
    if (headerPx !== undefined) base.px = headerPx
    if (column.minWidth) base.minWidth = column.minWidth
    if (column.width) base.width = column.width
    return base
  }

  return (
    <Paper sx={{ overflow: 'hidden' }}>
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table size={dense ? 'small' : 'medium'} sx={{ tableLayout: 'auto', width: '100%', minWidth: 600 }}>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.04)',
                borderBottom: 2,
                borderColor: 'divider',
                '& th': {
                  color: 'text.primary',
                  fontWeight: 700,
                },
              }}
            >
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align || 'left'} sx={getHeaderSx(column)}>
                  {column.header != null ? column.header : column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.length > 0 ? (
              data.map((row, index) => (
                <TableRow
                  key={row.id ?? row.unit_id ?? index}
                  hover
                  sx={{
                    backgroundColor: (theme) =>
                      index % 2 === 1
                        ? theme.palette.mode === 'dark'
                          ? 'rgba(255,255,255,0.03)'
                          : 'rgba(0,0,0,0.02)'
                        : 'transparent',
                    '&:not(:last-child) td': { borderBottom: 1, borderColor: 'divider' },
                    ...(typeof getRowSx === 'function' ? getRowSx(row, index) : {}),
                  }}
                >
                  {columns.map((column) => {
                    const cellContent = column.render ? column.render(row) : row[column.id]
                    const isClickable = typeof column.onClick === 'function'
                    return (
                      <TableCell
                        key={column.id}
                        align={column.align || 'left'}
                        onClick={isClickable ? (e) => { e.stopPropagation(); column.onClick(row); } : undefined}
                        sx={{
                          ...getCellSx(column),
                          ...(isClickable
                            ? {
                                cursor: 'pointer',
                                transition: 'background-color 0.2s ease',
                                '&:hover': {
                                  backgroundColor: 'action.hover',
                                },
                              }
                            : {}),
                        }}
                      >
                        {cellContent}
                      </TableCell>
                    )
                  })}
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
