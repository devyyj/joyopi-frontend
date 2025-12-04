// src/main.jsx

import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
// MUI ThemeProvider, CssBaseline import
import {ThemeProvider} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

import theme from './theme/theme.js' // 정의한 테마 파일 import
import App from "./App.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 1. CssBaseline: 모든 브라우저에서 CSS를 일관되게 초기화합니다. (가장 먼저 적용) */}
    <CssBaseline/>
    {/* 2. ThemeProvider: 하위 모든 MUI 컴포넌트에 테마 정보를 제공합니다. */}
    <ThemeProvider theme={theme}>
      <App/>
    </ThemeProvider>
  </StrictMode>,
)