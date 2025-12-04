// src/App.jsx

import React from 'react';
import { Box } from '@mui/material';

// 컴포넌트 및 페이지 import
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx'; // 메인 페이지

/**
 * @title 최상위 애플리케이션 컴포넌트
 * @description Header, Main Content, Footer를 포함하는 기본 레이아웃을 정의합니다.
 */
function App() {
  return (
    // Box: flexbox를 사용하여 전체 높이를 설정하고 Footer를 하단에 배치합니다.
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      {/* 1. Header 영역 */}
      <Header />

      {/* 2. Main Content 영역 (페이지가 렌더링되는 곳) */}
      {/* 현재는 Home 페이지만 렌더링하지만, 나중에 라우터가 들어갈 위치입니다. */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Home />
      </Box>

      {/* 3. Footer 영역 */}
      <Footer />
    </Box>
  );
}

export default App;