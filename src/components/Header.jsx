// src/components/Header.jsx

import React, { useState } from 'react';
import { AppBar, Box, Button, Menu, MenuItem, Toolbar, Typography, useTheme, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

/**
 * @title Web Service Header Component
 * @description Modern glassmorphism header with Acid Lime accents.
 */
function Header() {
  const navigate = useNavigate();
  const theme = useTheme();

  // 'Lab' menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ top: 0, zIndex: 1100 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: 64, justifyContent: 'space-between' }}>
          {/* 1. Logo/Service Name */}
          <Box
            onClick={handleLogoClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              userSelect: 'none',
              transform: 'scale(1)',
              transition: 'transform 0.2s ease',
              '&:hover': { transform: 'scale(1.02)' }
            }}
          >
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.02em',
                fontSize: '1.5rem',
              }}
            >
              Yopi
              <Box component="span" sx={{ color: theme.palette.primary.main, ml: 0.5 }}>
                sode
              </Box>
            </Typography>
          </Box>

          {/* 2. Navigation & Actions */}
          <Box display="flex" alignItems="center" gap={1}>
            {/* Lab Menu Trigger */}
            <Button
              color="inherit"
              onClick={handleMenuClick}
              endIcon={<KeyboardArrowDownIcon sx={{ color: open ? theme.palette.primary.main : 'inherit', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0)' }} />}
              sx={{
                fontWeight: 600,
                fontSize: '0.95rem',
                color: open ? theme.palette.primary.main : theme.palette.text.primary,
                '&:hover': {
                  color: theme.palette.primary.main,
                  bgcolor: 'transparent'
                },
              }}
            >
              Research Lab
            </Button>

            {/* Lab Menu Dropdown */}
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    mt: 1.5,
                    minWidth: 200,
                    overflow: 'visible',
                    bgcolor: (theme) => theme.palette.grey[900],
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 28,
                      width: 10,
                      height: 10,
                      bgcolor: (theme) => theme.palette.grey[900],
                      borderTop: '1px solid rgba(255,255,255,0.1)',
                      borderLeft: '1px solid rgba(255,255,255,0.1)',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }
              }}
            >
              <MenuItem onClick={() => handleMenuItemClick('/lab/nickname')} sx={{ py: 1.5 }}>
                <Box component="span" sx={{ mr: 1, color: theme.palette.primary.main }}>#01</Box>
                Nickname Analysis
              </MenuItem>
              <MenuItem onClick={() => handleMenuItemClick('/lab/lotto')} sx={{ py: 1.5 }}>
                <Box component="span" sx={{ mr: 1, color: theme.palette.primary.main }}>#02</Box>
                Lotto Stochastic
              </MenuItem>
              <MenuItem onClick={() => handleMenuItemClick('/lab/food')} sx={{ py: 1.5 }}>
                <Box component="span" sx={{ mr: 1, color: theme.palette.primary.main }}>#03</Box>
                Menu Optimization
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
