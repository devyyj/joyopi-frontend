// src/components/Header.jsx

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

/**
 * @title 웹 서비스 상단 헤더 컴포넌트
 * @description 주요 로고 및 네비게이션 링크를 포함합니다.
 */
function Header() {
  return (
    // AppBar: 상단 바 역할을 하며 기본적으로 그림자(elevation)를 가집니다.
    <AppBar position="static">
      <Toolbar>
        {/* 로고/서비스명 */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {/* component="div"로 사용하여 의미론적 태그를 유지하면서 Typography 스타일을 적용합니다. */}
          요피랜드
        </Typography>

        {/* 네비게이션 버튼들 */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Button color="inherit">소개</Button>
          <Button color="inherit">기능</Button>
          <Button color="inherit" variant="outlined" sx={{ ml: 1 }}>로그인</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;