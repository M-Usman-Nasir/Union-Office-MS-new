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
  Divider,
  Avatar,
  MenuItem,
  Chip,
  Alert,
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import PersonIcon from '@mui/icons-material/Person'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import HomeWorkIcon from '@mui/icons-material/HomeWork'
import { useAuth } from '@/contexts/AuthContext'
import { authApi } from '@/api/authApi'
import { unitClaimsApi } from '@/api/unitClaimsApi'
import { propertyApi } from '@/api/propertyApi'
import useSWR from 'swr'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { getImageUrl } from '@/utils/constants'

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  contact_number: Yup.string(),
  emergency_contact: Yup.string(),
})

const ResidentProfile = () => {
  const { user, mutate: mutateAuth } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [unitClaimUnitId, setUnitClaimUnitId] = useState('')
  const [claimSubmitting, setClaimSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  const { data: userData, mutate } = useSWR(
    user ? '/auth/me' : null,
    () => authApi.getMe().then(res => res.data.data)
  )

  const societyId = userData?.society_apartment_id ?? user?.society_apartment_id
  const unitId = userData?.unit_id ?? user?.unit_id
  const hasUnit = unitId != null

  const { data: claimData, mutate: mutateClaim } = useSWR(
    user && !hasUnit ? '/unit-claims/mine' : null,
    () => unitClaimsApi.getMine().then(res => res.data)
  )
  const myClaim = claimData?.data ?? null

  const { data: unitsData } = useSWR(
    societyId && !hasUnit ? ['/properties/units', societyId] : null,
    () => propertyApi.getUnits({ society_id: societyId }).then(res => res.data)
  )
  const units = unitsData?.data ?? []

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
      const imageUrl = userData.profile_image.startsWith('data:image/')
        ? userData.profile_image
        : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${userData.profile_image}`
      setImagePreview(imageUrl)
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
      await mutateAuth()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRequestUnitClaim = async () => {
    if (!unitClaimUnitId) {
      toast.error('Please select a unit')
      return
    }
    setClaimSubmitting(true)
    try {
      await unitClaimsApi.create({ unit_id: unitClaimUnitId })
      toast.success('Request submitted. Union admin will review it.')
      setUnitClaimUnitId('')
      mutateClaim()
      mutate()
      mutateAuth()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request')
    } finally {
      setClaimSubmitting(false)
    }
  }

  const profileData = userData || user
  const displayImage = imagePreview || getImageUrl(profileData?.profile_image)

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Profile
        </Typography>
      </Box> */}

      {/* Profile is now fully functional; no placeholder warning needed */}

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

      {/* Property / Unit section: show when resident has no unit — request ownership or show claim status */}
      {hasUnit ? (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <HomeWorkIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Your unit</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              You are linked to a unit. Contact union admin if you need to change it.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <HomeWorkIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Request ownership / tenancy</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              If you are an owner or tenant of a unit in your society, request to link your account. Union admin will approve or reject.
            </Typography>
            {!societyId ? (
              <Alert severity="info">
                You are not assigned to a society yet. Contact your union admin to be added to a society, then you can request a unit.
              </Alert>
            ) : myClaim ? (
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Your request: <strong>{myClaim.block_name ? `${myClaim.block_name} / ` : ''}{myClaim.unit_number ?? myClaim.unit_id}</strong>
                </Typography>
                <Chip
                  size="small"
                  label={myClaim.status}
                  color={myClaim.status === 'pending' ? 'warning' : myClaim.status === 'approved' ? 'success' : 'error'}
                  sx={{ mr: 1 }}
                />
                {myClaim.status === 'rejected' && myClaim.notes && (
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                    Note: {myClaim.notes}
                  </Typography>
                )}
                {myClaim.status !== 'pending' && (
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    You can submit a new request below if your previous one was rejected.
                  </Typography>
                )}
                {myClaim.status === 'rejected' && (
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Unit"
                      value={unitClaimUnitId}
                      onChange={(e) => setUnitClaimUnitId(e.target.value)}
                      sx={{ maxWidth: 280, mb: 1 }}
                    >
                      <MenuItem value="">Select unit</MenuItem>
                      {units.map((u) => (
                        <MenuItem key={u.id} value={u.id}>
                          {u.block_name ? `${u.block_name} / ` : ''}{u.unit_number} {u.society_name ? `(${u.society_name})` : ''}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Button
                      variant="outlined"
                      onClick={handleRequestUnitClaim}
                      disabled={claimSubmitting || !unitClaimUnitId}
                    >
                      {claimSubmitting ? 'Submitting…' : 'Submit new request'}
                    </Button>
                  </Box>
                )}
              </Box>
            ) : (
              <Box>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Unit"
                  value={unitClaimUnitId}
                  onChange={(e) => setUnitClaimUnitId(e.target.value)}
                  sx={{ maxWidth: 280, mb: 1 }}
                >
                  <MenuItem value="">Select unit</MenuItem>
                  {units.map((u) => (
                    <MenuItem key={u.id} value={u.id}>
                      {u.block_name ? `${u.block_name} / ` : ''}{u.unit_number} {u.society_name ? `(${u.society_name})` : ''}
                    </MenuItem>
                  ))}
                </TextField>
                <Button
                  variant="contained"
                  onClick={handleRequestUnitClaim}
                  disabled={claimSubmitting || !unitClaimUnitId}
                >
                  {claimSubmitting ? 'Submitting…' : 'Submit request'}
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Container>
  )
}

export default ResidentProfile
