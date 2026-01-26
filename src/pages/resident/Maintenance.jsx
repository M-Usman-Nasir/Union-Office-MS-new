import { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Chip,
  Card,
  CardContent,
  Grid,
} from '@mui/material'
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import { maintenanceApi } from '@/api/maintenanceApi'
import DataTable from '@/components/common/DataTable'
import dayjs from 'dayjs'

const ResidentMaintenance = () => {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { data, isLoading } = useSWR(
    ['/maintenance/my', page, limit],
    () => maintenanceApi.getAll({ page, limit, unit_id: user?.unit_id }).then(res => res.data)
  )

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
    }).format(amount || 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return dayjs(dateString).format('DD/MM/YYYY')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'success'
      case 'partially_paid':
        return 'warning'
      case 'pending':
        return 'error'
      default:
        return 'default'
    }
  }

  const columns = [
    { id: 'month', label: 'Month', render: (row) => `${row.month}/${row.year}` },
    { id: 'base_amount', label: 'Base Amount', render: (row) => formatCurrency(row.base_amount) },
    { id: 'total_amount', label: 'Total Amount', render: (row) => formatCurrency(row.total_amount) },
    { id: 'amount_paid', label: 'Amount Paid', render: (row) => formatCurrency(row.amount_paid || 0) },
    {
      id: 'status',
      label: 'Status',
      render: (row) => (
        <Chip label={row.status} color={getStatusColor(row.status)} size="small" />
      ),
    },
  ]

  const totalPending = data?.data?.filter(m => m.status === 'pending').reduce((sum, m) => sum + parseFloat(m.total_amount || 0), 0) || 0
  const totalPaid = data?.data?.filter(m => m.status === 'paid').reduce((sum, m) => sum + parseFloat(m.total_amount || 0), 0) || 0

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Maintenance
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="error.main">
                {formatCurrency(totalPending)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Amount
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">
                {formatCurrency(totalPaid)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Paid
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                {data?.pagination?.total || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Records
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <DataTable
        columns={columns}
        data={data?.data || []}
        loading={isLoading}
        pagination={data?.pagination}
        onPageChange={setPage}
        onRowsPerPageChange={(newLimit) => {
          setLimit(newLimit)
          setPage(1)
        }}
      />
    </Container>
  )
}

export default ResidentMaintenance
