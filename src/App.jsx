// src/App.jsx

import React from 'react';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { Routes, Route } from 'react-router-dom';

// Components and Pages import
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import LottoResearch from './pages/LottoResearch.jsx';
import NicknameResearch from './pages/NicknameResearch.jsx';
import FoodResearch from './pages/FoodResearch.jsx';

// Theme import (if not already handled in main.jsx, but good to ensure here if wrapping needed, 
// assuming main.jsx handles ThemeProvider, but App often structures the layout)
// In this project structure, main.jsx likely wraps App with ThemeProvider. 
// We will focus on the Layout Box here.

/**
 * @title Main Application Component
 * @description Defines the core layout with Header, Main Content, and Footer.
 *              Updated for Dark Mode "Cyber-Lab" aesthetic.
 */
function App() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default', // Ensure dark background from theme
        color: 'text.primary',
      }}
    >
      {/* 1. Header Area */}
      <Header />

      {/* 2. Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative', // Context for any absolute decorations
          zIndex: 1
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lab/lotto" element={<LottoResearch />} />
          <Route path="/lab/nickname" element={<NicknameResearch />} />
          <Route path="/lab/food" element={<FoodResearch />} />
        </Routes>
      </Box>

      {/* 3. Footer Area */}
      <Footer />
    </Box>
  );
}

export default App;
