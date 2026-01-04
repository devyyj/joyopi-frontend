// src/App.jsx

import React from 'react';
import { Box } from '@mui/material';
import { Routes, Route } from 'react-router-dom';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Parrot from './pages/Parrot.jsx';
import Vote from './pages/Vote.jsx';

/**
 * @title 최상위 애플리케이션 컴포넌트
 * @description Header, Main Content, Footer를 포함하는 기본 레이아웃을 정의합니다.
 */
function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/parrot" element={<Parrot />} />
          <Route path="/vote" element={<Vote />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
}

export default App;