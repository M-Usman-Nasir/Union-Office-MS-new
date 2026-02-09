import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material'
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import { apartmentApi } from '@/api/apartmentApi'
import { propertyApi } from '@/api/propertyApi'
import ApartmentIcon from '@mui/icons-material/Apartment'
import BusinessIcon from '@mui/icons-material/Business'
import HomeIcon from '@mui/icons-material/Home'
import BarChart from '@/components/charts/BarChart'

const SuperAdminDashboard = () => {
  const { user } = useAuth()

  // Fetch data
  const { data: societiesData, isLoading: societiesLoading } = useSWR(
    '/societies',
    () => apartmentApi.getAll({ limit: 100 }).then(res => res.data)
  )

  const { data: blocksData, isLoading: blocksLoading } = useSWR(
    '/properties/blocks',
    () => propertyApi.getBlocks().then(res => res.data)
  )

  const { data: unitsData, isLoading: unitsLoading } = useSWR(
    '/properties/units',
    () => propertyApi.getUnits({ limit: 100 }).then(res => res.data)
  )

  const isLoading = societiesLoading || blocksLoading || unitsLoading

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Super Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome, {user?.name || user?.email}
        </Typography>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" component="div">
                      {societiesData?.pagination?.total || societiesData?.data?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Apartments
                    </Typography>
                  </Box>
                  <ApartmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" component="div">
                      {blocksData?.data?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Blocks
                    </Typography>
                  </Box>
                  <BusinessIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" component="div">
                      {unitsData?.data?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Units
                    </Typography>
                  </Box>
                  <HomeIcon sx={{ fontSize: 40, color: 'success.main' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Statistics Chart */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  System Overview
                </Typography>
                {societiesData?.data && societiesData.data.length > 0 ? (
                  <BarChart
                    data={societiesData.data.map(society => ({
                      category: society.name,
                      value: society.total_units || 0,
                    }))}
                    title="Units per Apartment"
                    xLabel="Apartment"
                    yLabel="Total Units"
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                    No data available for chart
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Apartments List */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Apartments Overview
                </Typography>
                {societiesData?.data && societiesData.data.length > 0 ? (
                  <Grid container spacing={2}>
                    {societiesData.data.map((society) => (
                      <Grid item xs={12} md={6} key={society.id}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {society.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {society.address}, {society.city}
                            </Typography>
                            <Box mt={1} display="flex" gap={2}>
                              <Typography variant="body2">
                                <strong>Blocks:</strong> {society.total_blocks || 0}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Units:</strong> {society.total_units || 0}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No apartments found
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  )
}

export default SuperAdminDashboard
