import { Container, Typography, Box } from '@mui/material'

const UnionMembers = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box>
        <Typography variant="h5" component="h1" gutterBottom>
          Union Members
        </Typography>
        <Typography color="text.secondary">
          Union members management. Content can be added here.
        </Typography>
      </Box>
    </Container>
  )
}

export default UnionMembers
