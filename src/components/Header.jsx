// src/components/Header.jsx

import React from 'react';
import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

/**
 * @title 웹 서비스 상단 헤더 컴포넌트
 */
function Header() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <AppBar 
      position="static"
      sx={(theme) => ({
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        boxShadow: '0 1px 0 0 rgba(0, 0, 0, 0.05)',
      })}
    >
      <Toolbar>
        <Typography
          variant="h4"
          component="div"
          onClick={handleLogoClick}
          sx={{ cursor: 'pointer' }}
        >
          Yopisode
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
      </Toolbar>
    </AppBar>
  );
}

export default Header;