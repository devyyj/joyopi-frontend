// src/pages/Home.jsx

import React from 'react';
import { Container, Typography, Box } from '@mui/material';

/**
 * @title 메인 페이지 (Home Page)
 */
function Home() {
  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 12, minHeight: '60vh' }}>
      <Box textAlign="center">
        <Typography variant="h2" component="h1" gutterBottom>
          홈 페이지
        </Typography>
        <Typography variant="body1" color="text.secondary">
          새로운 프로젝트를 시작하세요.
        </Typography>
      </Box>
    </Container>
  );
}

export default Home;