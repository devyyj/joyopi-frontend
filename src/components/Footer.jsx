// src/components/Footer.jsx

import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';

/**
 * @title 웹 서비스 하단 푸터 컴포넌트
 * @description 저작권 정보 및 관련 링크를 표시합니다.
 */
function Footer() {
  return (
    // Box: 스타일링을 위한 래퍼 컴포넌트
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto', // 메인 콘텐츠가 적을 때 하단에 고정되도록 합니다.
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'Copyright © '}
          <Link color="inherit" href="https://dev.joyopi.com/">
            Joyopi
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;