// src/components/Footer.jsx

import React from 'react';
import { Box, Typography, Container } from '@mui/material';

/**
 * @title 웹 서비스 하단 푸터 컴포넌트
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={(theme) => ({
        py: { xs: 4, md: 6 },
        px: 2,
        mt: 'auto',
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: '#FFFFFF',
      })}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center" sx={{ fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
          © {currentYear} <Box component="span" sx={{ fontWeight: 800, color: 'text.primary' }}>JOYOPI</Box>. ALL RIGHTS RESERVED.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;