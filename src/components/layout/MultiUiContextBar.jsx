import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { ROUTES } from '@/utils/constants'
import { apartmentApi } from '@/api/apartmentApi'
import { userApi } from '@/api/userApi'
import { STORAGE_KEYS } from '@/utils/constants'

/**
 * Context pickers for hidden super admins: society (union admin UI), resident (resident UI), staff (staff UI).
 */
export default function MultiUiContextBar({ user }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [societies, setSocieties] = useState([])
  const [societyId, setSocietyId] = useState(() => localStorage.getItem(STORAGE_KEYS.HUMS_UI_SOCIETY_ID) || '')
  const [residentId, setResidentId] = useState(() => localStorage.getItem(STORAGE_KEYS.HUMS_UI_RESIDENT_ID) || '')
  const [staffId, setStaffId] = useState(() => localStorage.getItem(STORAGE_KEYS.HUMS_UI_STAFF_ID) || '')
  const [residents, setResidents] = useState([])
  const [staffList, setStaffList] = useState([])

  useEffect(() => {
    apartmentApi
      .getAll({ limit: 500, page: 1 })
      .then((r) => {
        const raw = r.data?.data ?? r.data
        setSocieties(Array.isArray(raw) ? raw : [])
      })
      .catch(() => setSocieties([]))
  }, [])

  useEffect(() => {
    if (!societyId) {
      setResidents([])
      return
    }
    userApi
      .getAll({ role: 'resident', society_id: societyId, limit: 400, page: 1 })
      .then((r) => {
        const raw = r.data?.data ?? r.data
        setResidents(Array.isArray(raw) ? raw : [])
      })
      .catch(() => setResidents([]))
  }, [societyId])

  useEffect(() => {
    userApi
      .getAll({ role: 'staff', limit: 400, page: 1 })
      .then((r) => {
        const raw = r.data?.data ?? r.data
        setStaffList(Array.isArray(raw) ? raw : [])
      })
      .catch(() => setStaffList([]))
  }, [location.pathname])

  const persist = (key, val) => {
    if (val) localStorage.setItem(key, String(val))
    else localStorage.removeItem(key)
  }

  if (!user?.hidden_from_ui) return null

  const p = location.pathname
  const showSociety = p.startsWith('/admin') || p.startsWith('/resident')
  const showResident = p.startsWith('/resident')
  const showStaff = p.startsWith('/staff')

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 0.5,
        mr: 1,
        maxWidth: { xs: '100%', sm: 640 },
      }}
    >
      <Button size="small" color="inherit" variant={p.startsWith('/super-admin') ? 'outlined' : 'text'} onClick={() => navigate(ROUTES.SUPER_ADMIN_DASHBOARD)}>
        Super
      </Button>
      <Button size="small" color="inherit" variant={p.startsWith('/admin') ? 'outlined' : 'text'} onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}>
        Union
      </Button>
      <Button size="small" color="inherit" variant={p.startsWith('/resident') ? 'outlined' : 'text'} onClick={() => navigate(ROUTES.RESIDENT_DASHBOARD)}>
        Resident
      </Button>
      <Button size="small" color="inherit" variant={p.startsWith('/staff') ? 'outlined' : 'text'} onClick={() => navigate(ROUTES.STAFF_DASHBOARD)}>
        Staff
      </Button>
      <Typography variant="caption" sx={{ opacity: 0.85, display: { xs: 'none', lg: 'inline' }, mx: 0.5 }}>
        Context
      </Typography>
      {showSociety && (
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="hums-ui-society">Society</InputLabel>
          <Select
            labelId="hums-ui-society"
            label="Society"
            value={societyId}
            onChange={(e) => {
              const v = e.target.value
              setSocietyId(v)
              persist(STORAGE_KEYS.HUMS_UI_SOCIETY_ID, v)
            }}
          >
            <MenuItem value="">
              <em>Select…</em>
            </MenuItem>
            {societies.map((s) => (
              <MenuItem key={s.id} value={String(s.id)}>
                {s.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      {showResident && (
        <FormControl size="small" sx={{ minWidth: 180 }} disabled={!societyId}>
          <InputLabel id="hums-ui-resident">View as resident</InputLabel>
          <Select
            labelId="hums-ui-resident"
            label="View as resident"
            value={residentId}
            onChange={(e) => {
              const v = e.target.value
              setResidentId(v)
              persist(STORAGE_KEYS.HUMS_UI_RESIDENT_ID, v)
            }}
          >
            <MenuItem value="">
              <em>Select…</em>
            </MenuItem>
            {residents.map((r) => (
              <MenuItem key={r.id} value={String(r.id)}>
                {r.name} ({r.email})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      {showStaff && (
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="hums-ui-staff">Staff user</InputLabel>
          <Select
            labelId="hums-ui-staff"
            label="Staff user"
            value={staffId}
            onChange={(e) => {
              const v = e.target.value
              setStaffId(v)
              persist(STORAGE_KEYS.HUMS_UI_STAFF_ID, v)
            }}
          >
            <MenuItem value="">
              <em>Select…</em>
            </MenuItem>
            {staffList.map((s) => (
              <MenuItem key={s.id} value={String(s.id)}>
                {s.name} ({s.email})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  )
}
