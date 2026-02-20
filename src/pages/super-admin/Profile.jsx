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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import PersonIcon from '@mui/icons-material/Person'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import LockIcon from '@mui/icons-material/Lock'
import { useAuth } from '@/contexts/AuthContext'
import { authApi } from '@/api/authApi'
import { userApi } from '@/api/userApi'
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

const passwordChangeSchema = Yup.object({
  new_password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('new_password'), null], 'Passwords must match')
    .required('Please confirm your password'),
})

const SuperAdminProfile = () => {
  const { user, mutate: mutateAuth } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
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

  const handleChangePassword = async (values) => {
    const userId = user?.id ?? userData?.id
    if (!userId) {
      toast.error('User not found')
      return
    }
    setIsChangingPassword(true)
    try {
      await userApi.updatePassword(userId, { new_password: values.new_password })
      toast.success('Password changed successfully')
      setPasswordDialogOpen(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password')
    } finally {
      setIsChangingPassword(false)
    }
  }

  const profileData = userData || user
  const displayImage = imagePreview || getImageUrl(profileData?.profile_image)

  return (
    <Container maxWidth="lg" sx={{ py: 1.5, px: { xs: 1.5, sm: 2 } }}>
      <Card sx={{ '& .MuiCardContent-root': { p: 2 } }}>
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
                <Grid container spacing={2}>
                  {/* Profile Image Section */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <PersonIcon sx={{ mr: 0.5, fontSize: 18, color: 'primary.main' }} />
                      <Typography variant="subtitle1" fontWeight={600}>Profile Picture</Typography>
                    </Box>
                    <Divider sx={{ mb: 1.5 }} />
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0 }}>
                      <Avatar
                        src={displayImage}
                        alt={profileData?.name || 'Profile'}
                        sx={{
                          width: 80,
                          height: 80,
                          fontSize: '2rem',
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
                            size="small"
                            startIcon={<PhotoCameraIcon sx={{ fontSize: 18 }} />}
                            sx={{ mr: 0.5 }}
                          >
                            {displayImage ? 'Change Photo' : 'Upload Photo'}
                          </Button>
                        </label>
                        {displayImage && (
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={handleRemoveImage}
                            sx={{ ml: 0.5 }}
                          >
                            Remove
                          </Button>
                        )}
                        <Typography variant="caption" display="block" sx={{ mt: 0.5, color: 'text.secondary' }}>
                          Square image, max 2MB (JPG, PNG)
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Account Information Section */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, mt: 0.5 }}>
                      <PersonIcon sx={{ mr: 0.5, fontSize: 18, color: 'primary.main' }} />
                      <Typography variant="subtitle1" fontWeight={600}>Account Information</Typography>
                    </Box>
                    <Divider sx={{ mb: 1.5 }} />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
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
                      size="small"
                      label="Email"
                      name="email"
                      type="email"
                      value={values.email}
                      disabled
                      helperText="Email cannot be changed"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">Role:</Typography>
                      <Chip label="Super Admin" color="error" size="small" />
                    </Box>
                  </Grid>

                  {/* Contact Information Section */}
                  <Grid item xs={12} sx={{ mt: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <PersonIcon sx={{ mr: 0.5, fontSize: 18, color: 'primary.main' }} />
                      <Typography variant="subtitle1" fontWeight={600}>Contact Information</Typography>
                    </Box>
                    <Divider sx={{ mb: 1.5 }} />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
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
                      size="small"
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
                      size="small"
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
                        size="small"
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
                        size="small"
                        label="Account Created"
                        value={new Date(profileData.created_at).toLocaleDateString()}
                        disabled
                      />
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="medium"
                        startIcon={<SaveIcon sx={{ fontSize: 18 }} />}
                        disabled={isSubmitting}
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

      {/* Change Password Section */}
      <Card sx={{ mt: 1.5, '& .MuiCardContent-root': { p: 2 } }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <LockIcon sx={{ mr: 0.5, fontSize: 18, color: 'primary.main' }} />
            <Typography variant="subtitle1" fontWeight={600}>Security</Typography>
          </Box>
          <Divider sx={{ mb: 1.5 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Change your account password. Use a strong password with at least 6 characters.
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<LockIcon sx={{ fontSize: 18 }} />}
            onClick={() => setPasswordDialogOpen(true)}
          >
            Change Password
          </Button>
        </CardContent>
      </Card>

      {/* Change Password Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => !isChangingPassword && setPasswordDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { '& .MuiDialogContent-root': { pt: 0 }, '& .MuiDialogActions-root': { px: 2, pb: 1.5 } } }}
      >
        <Formik
          initialValues={{ new_password: '', confirm_password: '' }}
          validationSchema={passwordChangeSchema}
          onSubmit={handleChangePassword}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <DialogTitle sx={{ pb: 0, pt: 1.5 }}>Change Password</DialogTitle>
              <DialogContent>
                <Grid container spacing={1.5} sx={{ mt: 0 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="New Password"
                      name="new_password"
                      type="password"
                      value={values.new_password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.new_password && !!errors.new_password}
                      helperText={touched.new_password && errors.new_password}
                      autoComplete="new-password"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Confirm New Password"
                      name="confirm_password"
                      type="password"
                      value={values.confirm_password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.confirm_password && !!errors.confirm_password}
                      helperText={touched.confirm_password && errors.confirm_password}
                      autoComplete="new-password"
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ pt: 0 }}>
                <Button size="small" onClick={() => setPasswordDialogOpen(false)} disabled={isChangingPassword}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" size="small" disabled={isChangingPassword}>
                  {isChangingPassword ? 'Updating...' : 'Update Password'}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Container>
  )
}

export default SuperAdminProfile
