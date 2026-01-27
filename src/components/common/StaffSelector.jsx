import { useState } from 'react'
import { Autocomplete, TextField, CircularProgress } from '@mui/material'
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import { userApi } from '@/api/userApi'

const StaffSelector = ({ value, onChange, error, helperText, societyId, ...props }) => {
  const { user } = useAuth()
  const [inputValue, setInputValue] = useState('')

  // Use provided societyId or fallback to current user's society
  const targetSocietyId = societyId || user?.society_apartment_id

  // Fetch staff list filtered by society
  const { data: staffData, isLoading } = useSWR(
    targetSocietyId ? ['/users/staff', targetSocietyId] : null,
    () => userApi.getAll({ role: 'staff', society_id: targetSocietyId, limit: 100 }).then(res => res.data)
  )

  const staffList = staffData?.data || []

  const getOptionLabel = (option) => {
    if (typeof option === 'string') return option
    return option ? `${option.name} (${option.email})` : ''
  }

  const isOptionEqualToValue = (option, value) => {
    if (!option || !value) return false
    return option.id === value.id || option.id === value
  }

  return (
    <Autocomplete
      options={staffList}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      value={value || null}
      onChange={(event, newValue) => {
        onChange(newValue ? newValue.id : null)
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue)
      }}
      loading={isLoading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select Staff"
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          {...props}
        />
      )}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          <div>
            <div style={{ fontWeight: 'bold' }}>{option.name}</div>
            <div style={{ fontSize: '0.875rem', color: '#666' }}>{option.email}</div>
          </div>
        </li>
      )}
    />
  )
}

export default StaffSelector
