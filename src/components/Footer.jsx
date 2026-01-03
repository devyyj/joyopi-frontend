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
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.grey[100],
      })}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'Powered by '}
          <Box component="span" sx={{ fontWeight: 'bold' }}>
            Joyopi
          </Box>
          {`. Copyright © ${currentYear}.`}
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;