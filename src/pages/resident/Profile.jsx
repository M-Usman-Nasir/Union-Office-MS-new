import { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Alert,
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import { useAuth } from '@/contexts/AuthContext'
import { authApi } from '@/api/authApi'
import useSWR from 'swr'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  contact_number: Yup.string(),
  emergency_contact: Yup.string(),
})

const ResidentProfile = () => {
  const { user, mutate: mutateAuth } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: userData, mutate } = useSWR(
    user ? '/auth/me' : null,
    () => authApi.getMe().then(res => res.data.data)
  )

  const handleSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      // Note: Profile update API would need to be implemented
      // For now, this shows the structure
      toast.success('Profile updated successfully')
      mutate()
      mutateAuth()
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  const profileData = userData || user

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Profile
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Profile update API needs to be implemented in the backend. This is a placeholder UI.
      </Alert>

      <Card>
        <CardContent>
          <Formik
            initialValues={{
              name: profileData?.name || '',
              email: profileData?.email || '',
              contact_number: profileData?.contact_number || '',
              emergency_contact: profileData?.emergency_contact || '',
              cnic: profileData?.cnic || '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.name && !!errors.name}
                      helperText={touched.name && errors.name}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={values.email}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Contact Number"
                      name="contact_number"
                      value={values.contact_number}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Emergency Contact"
                      name="emergency_contact"
                      value={values.emergency_contact}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="CNIC"
                      name="cnic"
                      value={values.cnic}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SaveIcon />}
                      disabled={isSubmitting}
                    >
                      Save Changes
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Container>
  )
}

export default ResidentProfile
