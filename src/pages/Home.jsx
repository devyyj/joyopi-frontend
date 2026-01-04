// src/pages/Home.jsx

import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const services = [
    { title: 'SECRET VOTE', path: '/vote' }
  ];

  return (
    <Box
      sx={{
        height: 'calc(100vh - 120px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontWeight: 800,
          letterSpacing: '-2px',
          fontSize: { xs: '4rem', md: '7rem' },
          mb: 6,
          color: 'text.primary',
          opacity: 0.9
        }}
      >
        JOYOPI
      </Typography>

      <Box sx={{ display: 'flex', gap: { xs: 4, sm: 8 } }}>
        {services.map((service) => (
          <Typography
            key={service.title}
            variant="h6"
            onClick={() => navigate(service.path)}
            sx={{
              fontWeight: 700,
              cursor: 'pointer',
              color: 'text.secondary',
              letterSpacing: '2px',
              fontSize: { xs: '1rem', sm: '1.2rem' },
              transition: 'all 0.3s ease',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                width: '0%',
                height: '2px',
                bottom: -4,
                left: 0,
                backgroundColor: 'text.primary',
                transition: 'width 0.3s ease'
              },
              '&:hover': {
                color: 'text.primary',
                transform: 'scale(1.05)',
                '&::after': {
                  width: '100%'
                }
              }
            }}
          >
            {service.title}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}

export default Home;