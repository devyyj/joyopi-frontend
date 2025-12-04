// src/main.jsx 예시
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme'; // 작성하신 theme.js import
import { BrowserRouter } from 'react-router-dom'; // BrowserRouter import

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BrowserRouter로 전체 앱을 감싸 라우팅 기능을 제공합니다. */}
    <BrowserRouter>
      {/* 1. 테마 공급 */}
      <ThemeProvider theme={theme}>
        {/* 2. CSS 초기화 및 전역 스타일(배경색, 폰트) 적용 - 필수! */}
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);