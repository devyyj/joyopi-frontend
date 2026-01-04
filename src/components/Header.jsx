// src/components/Header.jsx

import React from 'react';
import { AppBar, Box, Button, Toolbar, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

/**
 * @title 플로팅 필 스타일 헤더 컴포넌트
 */
function Header() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <Box sx={{ position: 'sticky', top: 20, zIndex: 1100, width: '100%', px: { xs: 2, sm: 4 } }}>
      <Container maxWidth="lg" sx={{ p: '0 !important' }}>
        <AppBar
          position="static"
          sx={{
            borderRadius: '50px',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            color: 'text.primary',
            boxShadow: '0 8px 32px rgba(15, 23, 42, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            px: { xs: 1, sm: 2 },
            mx: 'auto'
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 56, sm: 64 } }}>
            <Typography
              variant="h6"
              component="div"
              onClick={handleLogoClick}
              sx={{
                cursor: 'pointer',
                fontWeight: 900,
                letterSpacing: '-1px',
                display: 'flex',
                alignItems: 'center',
                color: 'secondary.main',
                fontSize: { xs: '1.1rem', sm: '1.3rem' }
              }}
            >
              JOYOPI
            </Typography>

            <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 } }}>
              <Button
                color="inherit"
                onClick={() => navigate('/vote')}
                sx={{
                  fontWeight: 700,
                  px: { xs: 2, sm: 3 },
                  borderRadius: '30px',
                  '&:hover': {
                    backgroundColor: 'rgba(15, 23, 42, 0.05)'
                  }
                }}
              >
                SECRET VOTE
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      </Container>
    </Box>
  );
}

export default Header;