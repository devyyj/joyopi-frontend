// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Pretendard", system-ui, sans-serif',
    h1: { fontWeight: 900 },
    h2: { fontWeight: 900 },
  },
  palette: {
    mode: 'light',
    primary: { main: '#475569', contrastText: '#FFFFFF' },
    secondary: { main: '#1E293B', contrastText: '#FFFFFF' },
    background: { default: '#F8FAFC', paper: '#FFFFFF' },
    text: { primary: '#0F172A', secondary: '#64748B' },
    divider: 'rgba(15, 23, 42, 0.08)',
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 40,
          textTransform: 'none',
          fontWeight: 700,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none', transform: 'translateY(-1px)' },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)',
          border: '1px solid rgba(15, 23, 42, 0.06)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;