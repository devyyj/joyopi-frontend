import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';
import { logout } from '../slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const LOGOUT_URL = import.meta.env.VITE_API_URL + "/logout";
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = useCallback(
    (open) => {
      setDrawerOpen(open);
    },
    [setDrawerOpen]
  );

  const handleLogout = () => {
    dispatch(logout());
    toggleDrawer(false);
    window.location.href = LOGOUT_URL
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const list = () => (
    <Box sx={{ width: 250 }} role="presentation" onClick={() => toggleDrawer(false)}>
      <List>
        {accessToken ? (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate('/profile')}>
                <PersonIcon sx={{ mr: 2 }} />
                <ListItemText primary="내 정보" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ExitToAppIcon sx={{ mr: 2 }} />
                <ListItemText primary="로그아웃" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogin}>
              <ListItemText primary="LOGIN" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
      <Divider />
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ boxShadow: 'none' }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ cursor: 'pointer' }}
            onClick={handleGoHome}
          >
            요피랜드
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}></Typography>
          {accessToken ? (
            <AccountCircle
              style={{ cursor: 'pointer' }}
              onClick={() => toggleDrawer(true)}
            />
          ) : (
            <Typography
              variant="body1"
              sx={{ cursor: 'pointer' }}
              onClick={handleLogin}
            >
              LOGIN
            </Typography>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
      >
        {list()}
      </Drawer>
    </Box>
  );
};

export default Navbar;