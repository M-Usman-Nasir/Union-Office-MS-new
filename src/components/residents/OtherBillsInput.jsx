import { Box, TextField, IconButton, Grid, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

const OtherBillsInput = ({ value = [], onChange, error, helperText }) => {
  const handleAddBill = () => {
    const newBills = [...value, { type: '', provider: '', amount: 0 }]
    onChange(newBills)
  }

  const handleRemoveBill = (index) => {
    const newBills = value.filter((_, i) => i !== index)
    onChange(newBills)
  }

  const handleChange = (index, field, fieldValue) => {
    const newBills = [...value]
    newBills[index] = {
      ...newBills[index],
      [field]: field === 'amount' ? parseFloat(fieldValue) || 0 : fieldValue,
    }
    onChange(newBills)
  }

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Other Bills
      </Typography>
      {value.map((bill, index) => (
        <Box
          key={index}
          sx={{
            mb: 2,
            p: 2,
            border: '1px solid',
            borderColor: error ? 'error.main' : 'divider',
            borderRadius: 1,
            bgcolor: 'background.default',
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                size="small"
                label="Type"
                value={bill.type || ''}
                onChange={(e) => handleChange(index, 'type', e.target.value)}
                placeholder="e.g., Internet, Cable TV"
                error={error}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Provider"
                value={bill.provider || ''}
                onChange={(e) => handleChange(index, 'provider', e.target.value)}
                error={error}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Amount"
                type="number"
                value={bill.amount || ''}
                onChange={(e) => handleChange(index, 'amount', e.target.value)}
                error={error}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1, fontSize: '0.875rem' }}>PKR</Typography>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={1}>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleRemoveBill(index)}
                sx={{ mt: 0.5 }}
              >
                <RemoveIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      ))}
      <Box>
        <IconButton
          size="small"
          onClick={handleAddBill}
          sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
          Add Other Bill
        </Typography>
      </Box>
      {helperText && (
        <Typography variant="caption" color={error ? 'error.main' : 'text.secondary'} sx={{ mt: 0.5, display: 'block' }}>
          {helperText}
        </Typography>
      )}
    </Box>
  )
}

export default OtherBillsInput
