// src/components/Footer.jsx

import React from 'react';
// Link 컴포넌트는 더 이상 Joyopi에 사용되지 않지만, Typography, Box 등은 계속 사용합니다.
import { Box, Typography, Container } from '@mui/material';

/**
 * @title 웹 서비스 하단 푸터 컴포넌트
 * @description 저작권 정보 및 관련 링크를 표시합니다.
 */
function Footer() {
  // 현재 연도를 동적으로 가져와 저작권 연도를 표시합니다.
  const currentYear = new Date().getFullYear();

  return (
    // Box: 스타일링을 위한 래퍼 컴포넌트
    <Box
      component="footer"
      sx={(theme) => ({
        py: 3,
        px: 2,
        mt: 'auto', // 메인 콘텐츠가 적을 때 하단에 고정되도록 합니다.
        backgroundColor: theme.palette.secondary.main,
      })}
    >
      <Container maxWidth="lg">
        {/* [변경] 'Powered by Joyopi. Copyright © [Year].' 문구 적용 */}
        <Typography
          variant="body2"
          color="secondary.contrastText"
          align="center"
        >
          {'Powered by '}
          {/* Joyopi 텍스트에서 Link 컴포넌트를 제거하고, Box component="span"으로 굵은 글씨 스타일만 유지했습니다. */}
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