// src/components/Footer.jsx

import React from 'react';
import { Box, Typography, Container } from '@mui/material';

/**
 * @title 웹 서비스 하단 푸터 컴포넌트
 * @description 저작권 정보 및 관련 링크를 표시하며, 디자인을 단조롭게 변경합니다.
 */
function Footer() {
  // 현재 연도를 동적으로 가져와 저작권 연도를 표시합니다.
  const currentYear = new Date().getFullYear();

  return (
    // [단조로운 디자인 적용] 배경: 밝은 회색, 텍스트: 보조 텍스트 색상
    <Box
      component="footer"
      sx={(theme) => ({
        py: 3,
        px: 2,
        mt: 'auto', // 메인 콘텐츠가 적을 때 하단에 고정되도록 합니다.
        backgroundColor: theme.palette.grey[100], // 밝은 회색 톤으로 변경
      })}
    >
      <Container maxWidth="lg">
        <Typography
          variant="body2"
          color="text.secondary" // 보조 텍스트 색상(#4B5563) 적용하여 대비를 낮춥니다.
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