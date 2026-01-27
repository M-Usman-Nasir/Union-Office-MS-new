import { useState, useRef, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Chip,
  Divider,
  Avatar,
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import PersonIcon from '@mui/icons-material/Person'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import { useAuth } from '@/contexts/AuthContext'
import { authApi } from '@/api/authApi'
import useSWR from 'swr'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { getImageUrl } from '@/utils/constants'

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  contact_number: Yup.string(),
  emergency_contact: Yup.string(),
  cnic: Yup.string(),
})

const AdminProfile = () => {
  const { user, mutate: mutateAuth } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)

  const { data: userData, mutate } = useSWR(
    user ? '/auth/me' : null,
    () => authApi.getMe().then(res => res.data.data)
  )

  // Set initial image preview when userData loads
  useEffect(() => {
    if (userData?.profile_image) {
      setImagePreview(getImageUrl(userData.profile_image))
    } else {
      setImagePreview(null)
    }
  }, [userData])

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB')
      return
    }

    // Store file for upload
    setSelectedFile(file)
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)
  }

  const handleRemoveImage = () => {
    setSelectedFile(null)
    // Reset to original image or null
    if (userData?.profile_image) {
      setImagePreview(getImageUrl(userData.profile_image))
    } else {
      setImagePreview(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      // Call backend profile update API with file upload
      await authApi.updateProfile(
        {
          name: values.name,
          contact_number: values.contact_number || null,
          emergency_contact: values.emergency_contact || null,
          cnic: values.cnic || null,
        },
        selectedFile // Pass file for FormData upload
      )

      toast.success('Profile updated successfully')
      setSelectedFile(null) // Clear selected file after successful upload
      await mutate()
      if (mutateAuth) {
        await mutateAuth()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  const profileData = userData || user
  const displayImage = imagePreview || getImageUrl(profileData?.profile_image)

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
          My Profile
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your account information and personal details
        </Typography>
      </Box>

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
                  {/* Profile Image Section */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6">Profile Picture</Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                      <Avatar
                        src={displayImage}
                        alt={profileData?.name || 'Profile'}
                        sx={{
                          width: 120,
                          height: 120,
                          fontSize: '3rem',
                          bgcolor: 'primary.main',
                        }}
                      >
                        {!displayImage && (profileData?.name?.charAt(0)?.toUpperCase() || 'U')}
                      </Avatar>
                      <Box>
                        <input
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="profile-image-upload"
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                        />
                        <label htmlFor="profile-image-upload">
                          <Button
                            variant="outlined"
                            component="span"
                            startIcon={<PhotoCameraIcon />}
                            sx={{ mr: 1 }}
                          >
                            {displayImage ? 'Change Photo' : 'Upload Photo'}
                          </Button>
                        </label>
                        {displayImage && (
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={handleRemoveImage}
                            sx={{ ml: 1 }}
                          >
                            Remove
                          </Button>
                        )}
                        <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                          Recommended: Square image, max 2MB (JPG, PNG)
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Account Information Section */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 2 }}>
                      <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6">Account Information</Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                  </Grid>

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
                      required
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
                      helperText="Email cannot be changed"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Role:
                      </Typography>
                      <Chip
                        label="Union Admin"
                        color="primary"
                        size="small"
                      />
                    </Box>
                  </Grid>

                  {/* Contact Information Section */}
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6">Contact Information</Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Contact Number"
                      name="contact_number"
                      value={values.contact_number}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g., 03001234567"
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
                      placeholder="e.g., 03001234567"
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
                      placeholder="e.g., 12345-1234567-1"
                    />
                  </Grid>

                  {/* Account Details (Read-only) */}
                  {profileData?.last_login && (
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Last Login"
                        value={new Date(profileData.last_login).toLocaleString()}
                        disabled
                      />
                    </Grid>
                  )}

                  {profileData?.created_at && (
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Account Created"
                        value={new Date(profileData.created_at).toLocaleDateString()}
                        disabled
                      />
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<SaveIcon />}
                        disabled={isSubmitting}
                        size="large"
                      >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </Box>
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

export default AdminProfile
