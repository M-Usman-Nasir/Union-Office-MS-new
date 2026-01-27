import { useState } from 'react'
import {
  Box,
  Typography,
  Chip,
  Collapse,
  IconButton,
  Divider,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import dayjs from 'dayjs'

const ProgressTimeline = ({ progressEntries = [] }) => {
  const [expandedIndex, setExpandedIndex] = useState(null)

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
      case 'closed':
        return 'success'
      case 'in_progress':
        return 'info'
      case 'pending':
        return 'warning'
      default:
        return 'default'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return dayjs(dateString).format('DD/MM/YYYY HH:mm')
  }

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  if (!progressEntries || progressEntries.length === 0) {
    return (
      <Box sx={{ py: 2 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          No progress history available
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ py: 2 }}>
      {progressEntries.map((progress, index) => (
        <Box key={index}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              mb: 2,
            }}
          >
            {/* Timeline Line */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mr: 2,
                minWidth: 40,
              }}
            >
              {/* Status Dot */}
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: (theme) => {
                    const color = getStatusColor(progress.status)
                    return theme.palette[color]?.main || theme.palette.grey[400]
                  },
                  border: '2px solid',
                  borderColor: 'background.paper',
                  boxShadow: 1,
                }}
              />
              {/* Vertical Line */}
              {index < progressEntries.length - 1 && (
                <Box
                  sx={{
                    width: 2,
                    flex: 1,
                    bgcolor: 'divider',
                    minHeight: 40,
                    mt: 0.5,
                  }}
                />
              )}
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 0.5,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={progress.status?.replace('_', ' ').toUpperCase() || 'Unknown'}
                    color={getStatusColor(progress.status)}
                    size="small"
                  />
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(progress.created_at)}
                  </Typography>
                </Box>
                {progress.notes && (
                  <IconButton
                    size="small"
                    onClick={() => toggleExpand(index)}
                    sx={{ ml: 1 }}
                  >
                    {expandedIndex === index ? (
                      <ExpandLessIcon fontSize="small" />
                    ) : (
                      <ExpandMoreIcon fontSize="small" />
                    )}
                  </IconButton>
                )}
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Updated by: <strong>{progress.updated_by_name || 'Unknown'}</strong>
              </Typography>

              {progress.notes && (
                <Collapse in={expandedIndex === index}>
                  <Box
                    sx={{
                      mt: 1,
                      p: 1.5,
                      bgcolor: 'background.default',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
                      {progress.notes}
                    </Typography>
                  </Box>
                </Collapse>
              )}
            </Box>
          </Box>
          {index < progressEntries.length - 1 && <Divider sx={{ ml: 5, mb: 1 }} />}
        </Box>
      ))}
    </Box>
  )
}

export default ProgressTimeline
