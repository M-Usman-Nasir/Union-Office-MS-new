import { useState, useRef, useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
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
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import PersonIcon from '@mui/icons-material/Person'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import HomeWorkIcon from '@mui/icons-material/HomeWork'
import BoltIcon from '@mui/icons-material/Bolt'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import GroupIcon from '@mui/icons-material/Group'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CampaignIcon from '@mui/icons-material/Campaign'
import BuildIcon from '@mui/icons-material/Build'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import InfoIcon from '@mui/icons-material/Info'
import { useAuth } from '@/contexts/AuthContext'
import { authApi } from '@/api/authApi'
import { residentApi } from '@/api/residentApi'
import { unitClaimsApi } from '@/api/unitClaimsApi'
import { propertyApi } from '@/api/propertyApi'
import useSWR from 'swr'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { getImageUrl, ROUTES } from '@/utils/constants'

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  contact_number: Yup.string(),
  emergency_contact: Yup.string(),
  cnic: Yup.string(),
})

const ResidentProfile = () => {
  const { user, mutate: mutateAuth } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [unitClaimUnitId, setUnitClaimUnitId] = useState('')
  const [claimSubmitting, setClaimSubmitting] = useState(false)
  const [familyMemberName, setFamilyMemberName] = useState('')
  const [familyMemberRelation, setFamilyMemberRelation] = useState('')
  const [addFamilyMemberLoading, setAddFamilyMemberLoading] = useState(false)
  const fileInputRef = useRef(null)

  const { data: userData, mutate } = useSWR(
    user ? '/auth/me' : null,
    () => authApi.getMe().then(res => res.data.data)
  )

  // Full resident record (when backend allows resident to fetch own record)
  const { data: residentData, mutate: mutateResident } = useSWR(
    user?.id ? ['/residents/me', user.id] : null,
    () => residentApi.getById(user.id).then(res => res.data?.data ?? res.data),
    { revalidateOnFocus: false, errorRetryCount: 0 }
  )

  const { data: familyMembersData, mutate: mutateFamily } = useSWR(
    user?.id ? ['/family-members', user.id] : null,
    () => residentApi.getFamilyMembers(user.id).then(res => res.data),
    { revalidateOnFocus: false, errorRetryCount: 0 }
  )

  const societyId = residentData?.society_apartment_id ?? userData?.society_apartment_id ?? user?.society_apartment_id
  const unitId = residentData?.unit_id ?? userData?.unit_id ?? user?.unit_id
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

  // Merge: full resident record takes precedence for display and form
  const profileData = residentData || userData || user
  const familyMembers = familyMembersData?.data || []

  // Set initial image preview when profileData loads
  useEffect(() => {
    if (profileData?.profile_image) {
      setImagePreview(getImageUrl(profileData.profile_image))
    } else {
      setImagePreview(null)
    }
  }, [profileData?.profile_image])

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB')
      return
    }

    setSelectedFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleRemoveImage = () => {
    setSelectedFile(null)
    if (profileData?.profile_image) {
      setImagePreview(getImageUrl(profileData.profile_image))
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
      await authApi.updateProfile(
        {
          name: values.name,
          contact_number: values.contact_number || null,
          emergency_contact: values.emergency_contact || null,
          cnic: values.cnic || null,
        },
        selectedFile
      )

      // Update extended resident fields if we have resident API access
      if (user?.id) {
        try {
          await residentApi.update(user.id, {
            k_electric_account: values.k_electric_account || null,
            gas_account: values.gas_account || null,
            water_account: values.water_account || null,
            phone_tv_account: values.phone_tv_account || null,
            number_of_cars: values.number_of_cars || null,
            car_make_model: values.car_make_model || null,
            license_plate: values.license_plate || null,
            number_of_bikes: values.number_of_bikes || null,
            bike_make_model: values.bike_make_model || null,
            bike_license_plate: values.bike_license_plate || null,
          })
          await mutateResident()
        } catch (err) {
          // Backend may not allow resident to update extended fields
          if (err.response?.status !== 403 && err.response?.status !== 401) {
            toast.error(err.response?.data?.message || 'Some details could not be updated')
          }
        }
      }

      toast.success('Profile updated successfully')
      setSelectedFile(null)
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

  const handleAddFamilyMember = async () => {
    const name = familyMemberName.trim()
    if (!name) {
      toast.error('Name is required')
      return
    }
    if (!user?.id) return
    setAddFamilyMemberLoading(true)
    try {
      await residentApi.createFamilyMember(user.id, {
        name,
        relation: familyMemberRelation.trim() || undefined,
      })
      toast.success('Family member added')
      setFamilyMemberName('')
      setFamilyMemberRelation('')
      await mutateFamily()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add family member')
    } finally {
      setAddFamilyMemberLoading(false)
    }
  }

  const handleRemoveFamilyMember = async (fmId) => {
    if (!user?.id) return
    try {
      await residentApi.removeFamilyMember(user.id, fmId)
      toast.success('Family member removed')
      await mutateFamily()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove family member')
    }
  }

  const displayImage = imagePreview || getImageUrl(profileData?.profile_image)

  const quickLinks = [
    { to: ROUTES.RESIDENT_COMPLAINTS, label: 'Complaints', icon: <CampaignIcon /> },
    { to: ROUTES.RESIDENT_MAINTENANCE, label: 'Maintenance', icon: <BuildIcon /> },
    { to: ROUTES.RESIDENT_FINANCIAL_SUMMARY, label: 'Financial Summary', icon: <ReceiptLongIcon /> },
    { to: ROUTES.RESIDENT_UNION_INFO, label: 'Union Info', icon: <InfoIcon /> },
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 1.5, px: 1 }}>
      <Card sx={{ '& .MuiCardContent-root': { p: 1.5 } }}>
        <CardContent>
          <Formik
            initialValues={{
              name: profileData?.name || '',
              email: profileData?.email || '',
              contact_number: profileData?.contact_number || '',
              emergency_contact: profileData?.emergency_contact || '',
              cnic: profileData?.cnic || '',
              k_electric_account: profileData?.k_electric_account || '',
              gas_account: profileData?.gas_account || '',
              water_account: profileData?.water_account || '',
              phone_tv_account: profileData?.phone_tv_account || '',
              number_of_cars: profileData?.number_of_cars ?? '',
              car_make_model: profileData?.car_make_model || '',
              license_plate: profileData?.license_plate || '',
              number_of_bikes: profileData?.number_of_bikes ?? '',
              bike_make_model: profileData?.bike_make_model || '',
              bike_license_plate: profileData?.bike_license_plate || '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form>
                <Grid container spacing={2}>
                  {/* Profile Picture */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <PersonIcon sx={{ mr: 0.5, fontSize: 18, color: 'primary.main' }} />
                      <Typography variant="subtitle1" fontWeight={600}>Profile Picture</Typography>
                    </Box>
                    <Divider sx={{ mb: 1 }} />
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
                            startIcon={<PhotoCameraIcon />}
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

                  {/* Basic info */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, mt: 0.5 }}>
                      <PersonIcon sx={{ mr: 0.5, fontSize: 18, color: 'primary.main' }} />
                      <Typography variant="subtitle1" fontWeight={600}>Personal Information</Typography>
                    </Box>
                    <Divider sx={{ mb: 1 }} />
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
                    />
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
                    />
                  </Grid>

                  {/* Utilities */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, mt: 0.5 }}>
                      <BoltIcon sx={{ mr: 0.5, fontSize: 18, color: 'primary.main' }} />
                      <Typography variant="subtitle1" fontWeight={600}>Utilities</Typography>
                    </Box>
                    <Divider sx={{ mb: 1 }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="K-Electric Account"
                      name="k_electric_account"
                      value={values.k_electric_account}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Gas Account"
                      name="gas_account"
                      value={values.gas_account}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Water Account"
                      name="water_account"
                      value={values.water_account}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Phone / TV Account"
                      name="phone_tv_account"
                      value={values.phone_tv_account}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>

                  {/* Car */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, mt: 0.5 }}>
                      <DirectionsCarIcon sx={{ mr: 0.5, fontSize: 18, color: 'primary.main' }} />
                      <Typography variant="subtitle1" fontWeight={600}>Car</Typography>
                    </Box>
                    <Divider sx={{ mb: 1 }} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Number of Cars"
                      name="number_of_cars"
                      type="number"
                      inputProps={{ min: 0 }}
                      value={values.number_of_cars}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Make & Model"
                      name="car_make_model"
                      value={values.car_make_model}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="License Plate"
                      name="license_plate"
                      value={values.license_plate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>

                  {/* Bike */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, mt: 0.5 }}>
                      <TwoWheelerIcon sx={{ mr: 0.5, fontSize: 18, color: 'primary.main' }} />
                      <Typography variant="subtitle1" fontWeight={600}>Bike</Typography>
                    </Box>
                    <Divider sx={{ mb: 1 }} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Number of Bikes"
                      name="number_of_bikes"
                      type="number"
                      inputProps={{ min: 0 }}
                      value={values.number_of_bikes}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Make & Model"
                      name="bike_make_model"
                      value={values.bike_make_model}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="License Plate"
                      name="bike_license_plate"
                      value={values.bike_license_plate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="small"
                      startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving…' : 'Save Changes'}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>

      {/* Unit section */}
      {hasUnit ? (
        <Card sx={{ mt: 1.5, '& .MuiCardContent-root': { py: 1, px: 1.5 } }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <HomeWorkIcon sx={{ mr: 0.5, fontSize: 18, color: 'primary.main' }} />
              <Typography variant="subtitle1" fontWeight={600}>Your Unit</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Unit: <strong>{profileData?.unit_number ?? unitId}</strong>. Contact union admin if you need to change it.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ mt: 1.5, '& .MuiCardContent-root': { py: 1, px: 1.5 } }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <HomeWorkIcon sx={{ mr: 0.5, fontSize: 18, color: 'primary.main' }} />
              <Typography variant="subtitle1" fontWeight={600}>Request ownership / tenancy</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
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
                  <Box sx={{ mt: 1 }}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Unit"
                      value={unitClaimUnitId}
                      onChange={(e) => setUnitClaimUnitId(e.target.value)}
                      sx={{ maxWidth: 280, mb: 0.5 }}
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
                  sx={{ maxWidth: 280, mb: 0.5 }}
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

      {/* Defaulter status (read-only) */}
      {(profileData?.defaulter_status != null || profileData?.defaulter_amount_due != null) && (
        <Card sx={{ mt: 1.5, '& .MuiCardContent-root': { py: 1, px: 1.5 } }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <WarningAmberIcon sx={{ mr: 0.5, fontSize: 18, color: 'warning.main' }} />
              <Typography variant="subtitle1" fontWeight={600}>Dues Status</Typography>
            </Box>
            <Typography variant="body2">
              {profileData.defaulter_status
                ? `${profileData.defaulter_status}${profileData.defaulter_amount_due != null ? ` (Amount due: ${profileData.defaulter_amount_due})` : ''}${profileData.defaulter_months_overdue != null ? `, ${profileData.defaulter_months_overdue} mo. overdue` : ''}`
                : 'Not a defaulter'}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Family members */}
      <Card sx={{ mt: 1.5, '& .MuiCardContent-root': { py: 1, px: 1.5 } }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <GroupIcon sx={{ mr: 0.5, fontSize: 18, color: 'primary.main' }} />
            <Typography variant="subtitle1" fontWeight={600}>Family Members</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Add family members living with you. You can edit or remove them here.
          </Typography>
          {familyMembers.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No family members added yet.
            </Typography>
          ) : (
            <List dense disablePadding sx={{ mb: 0 }}>
              {familyMembers.map((fm) => (
                <ListItem
                  key={fm.id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      size="small"
                      aria-label="Remove"
                      onClick={() => handleRemoveFamilyMember(fm.id)}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  }
                  disablePadding
                  sx={{ py: 0.25 }}
                >
                  <ListItemText
                    primary={fm.name}
                    secondary={fm.relation ? `Relation: ${fm.relation}` : null}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              ))}
            </List>
          )}
          <Divider sx={{ my: 1 }} />
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
            Add family member
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Name"
              value={familyMemberName}
              onChange={(e) => setFamilyMemberName(e.target.value)}
              sx={{ minWidth: 160 }}
              disabled={addFamilyMemberLoading}
            />
            <TextField
              size="small"
              placeholder="Relation (e.g. Spouse, Child)"
              value={familyMemberRelation}
              onChange={(e) => setFamilyMemberRelation(e.target.value)}
              sx={{ minWidth: 180 }}
              disabled={addFamilyMemberLoading}
            />
            <Button
              size="small"
              variant="contained"
              startIcon={addFamilyMemberLoading ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
              onClick={handleAddFamilyMember}
              disabled={addFamilyMemberLoading}
            >
              Add
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Quick links */}
      <Card sx={{ mt: 1.5, '& .MuiCardContent-root': { py: 1, px: 1.5 } }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <InfoIcon sx={{ mr: 0.5, fontSize: 18, color: 'primary.main' }} />
            <Typography variant="subtitle1" fontWeight={600}>Quick Links</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Access your complaints, maintenance, finances, and union information.
          </Typography>
          <List dense disablePadding>
            {quickLinks.map((link) => (
              <ListItem key={link.to} disablePadding sx={{ py: 0 }}>
                <ListItemButton component={RouterLink} to={link.to} sx={{ py: 0.5, minHeight: 36 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>{link.icon}</ListItemIcon>
                  <ListItemText primary={link.label} primaryTypographyProps={{ variant: 'body2' }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Container>
  )
}

export default ResidentProfile
