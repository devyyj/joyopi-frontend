// src/pages/Home.jsx

import React from 'react';
import { Container, Typography, Box, Button, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [message, setMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  const handleCallApi = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch('/api/test/hello');
      if (!response.ok) throw new Error('ERR');
      const data = await response.text();
      setMessage(data);
    } catch (err) {
      setError(err.message || 'ERR');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 12, md: 20 }, textAlign: 'center' }}>
      <Typography
        variant="h1"
        sx={{
          fontWeight: 900,
          letterSpacing: '-3px',
          fontSize: { xs: '3.5rem', md: '7rem' },
          lineHeight: 1,
          mb: 8,
          color: 'text.primary'
        }}
      >
        JOYOPI
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center', alignItems: 'center' }}>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={handleCallApi}
          disabled={loading}
          sx={{ py: 2, px: 6, borderRadius: '40px' }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'START'}
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/parrot')}
          sx={{ py: 2, px: 6, borderRadius: '40px', color: 'text.primary', borderColor: 'divider' }}
        >
          PARROT
        </Button>
      </Box>

      <Box sx={{ mt: 8, maxWidth: '500px', mx: 'auto' }}>
        {message && <Alert severity="success" sx={{ borderRadius: 4 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ borderRadius: 4 }}>{error}</Alert>}
      </Box>
    </Container>
  );
}

export default Home;