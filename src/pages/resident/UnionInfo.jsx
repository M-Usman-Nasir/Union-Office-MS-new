import { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from '@mui/material'
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import { apartmentApi } from '@/api/apartmentApi'
import { propertyApi } from '@/api/propertyApi'
import ApartmentIcon from '@mui/icons-material/Apartment'
import BusinessIcon from '@mui/icons-material/Business'
import HomeIcon from '@mui/icons-material/Home'

const UnionInfo = () => {
  const { user } = useAuth()
  const [societyId] = useState(user?.society_apartment_id)

  const { data: societyData, isLoading: societyLoading } = useSWR(
    societyId ? ['/societies', societyId] : null,
    () => apartmentApi.getById(societyId).then(res => res.data.data)
  )

  const { data: blocksData } = useSWR(
    societyId ? ['/blocks', societyId] : null,
    () => propertyApi.getBlocks({ society_id: societyId }).then(res => res.data)
  )

  const { data: unitsData } = useSWR(
    societyId ? ['/units', societyId] : null,
    () => propertyApi.getUnits({ society_id: societyId }).then(res => res.data)
  )

  if (societyLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          Union Information
        </Typography>
      </Box>

      {societyData ? (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {societyData.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {societyData.address}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {societyData.city}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <BusinessIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h4">
                      {societyData.total_blocks || blocksData?.data?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Blocks
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <HomeIcon sx={{ fontSize: 40, color: 'success.main' }} />
                  <Box>
                    <Typography variant="h4">
                      {societyData.total_units || unitsData?.data?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Units
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <ApartmentIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
                  <Box>
                    <Typography variant="h4">
                      {blocksData?.data?.reduce((sum, block) => sum + (block.total_floors || 0), 0) || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Floors
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" align="center">
              No union information available
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  )
}

export default UnionInfo
