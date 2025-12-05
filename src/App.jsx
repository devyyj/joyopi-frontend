// src/App.jsx

import React from 'react';
import { Box } from '@mui/material';
import { Routes, Route } from 'react-router-dom'; // Routes, Route import

// 컴포넌트 및 페이지 import
import Header from './components/Header.jsx'; //
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx'; // 메인 페이지
import LottoResearch from './pages/LottoResearch.jsx'; // 새 페이지 import
import NicknameResearch from './pages/NicknameResearch.jsx';
import FoodResearch from "./pages/FoodResearch.jsx"; // 새 페이지 import

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
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* 라우팅을 사용하여 경로에 따라 다른 페이지를 렌더링합니다. */}
        <Routes>
          {/* 메인 화면 */}
          <Route path="/" element={<Home />} />
          {/* 로또 번호 생성기 화면 */}
          <Route path="/lab/lotto" element={<LottoResearch />} />
          {/* 닉네임 생성기 화면 */}
          <Route path="/lab/nickname" element={<NicknameResearch />} />
          <Route path="/lab/food" element={<FoodResearch />} />
          {/* 매칭되는 경로가 없을 때의 처리는 필요에 따라 추가합니다. */}
        </Routes>
      </Box>

      {/* 3. Footer 영역 */}
      <Footer />
    </Box>
  );
}

export default App;