// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: [
      '"Inter"',
      '"Pretendard"',
      '-apple-system',
      'BlinkMacSystemFont',
      'system-ui',
      'Roboto',
      'sans-serif',
    ].join(','),
    h1: { fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em', color: '#FFFFFF' },
    h3: { fontWeight: 700, letterSpacing: '-0.01em', color: '#FFFFFF' },
    h4: { fontWeight: 700, color: '#FFFFFF' },
    h5: { fontWeight: 600, color: '#FFFFFF' },
    h6: { fontWeight: 600, color: '#FFFFFF' },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
    subtitle1: { letterSpacing: '-0.01em', color: '#A1A1AA' },
    body1: { letterSpacing: '-0.01em', lineHeight: 1.6, color: '#D4D4D8' },
    body2: { letterSpacing: '-0.01em', color: '#A1A1AA' },
    caption: { color: '#71717A' },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#D2F802', // Acid Lime - Key accent
      light: '#E2FC52',
      dark: '#A6C700',
      contrastText: '#000000',
    },
    secondary: {
      main: '#FFFFFF',
      light: '#FFFFFF',
      dark: '#CCCCCC',
      contrastText: '#000000',
    },
    background: {
      default: '#121212', // Deep Dark Grey
      paper: '#1E1E1E',   // Slightly lighter for cards
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#A1A1AA', // Zinc 400
      disabled: '#52525B',  // Zinc 600
    },
    grey: {
      50: '#FAFAFA',
      100: '#F4F4F5',
      200: '#E4E4E7',
      300: '#D4D4D8',
      400: '#A1A1AA',
      500: '#71717A',
      600: '#52525B',
      700: '#3F3F46',
      800: '#27272A',
      900: '#18181B',
    },
    action: {
      hover: 'rgba(210, 248, 2, 0.08)',
      selected: 'rgba(210, 248, 2, 0.16)',
    },
    divider: 'rgba(255, 255, 255, 0.1)',
  },
  shape: {
    borderRadius: 8, // Sharper, tech feel
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#121212',
          scrollbarColor: '#3F3F46 #18181B',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#18181B',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#3F3F46',
            borderRadius: '4px',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(18, 18, 18, 0.8)', // Glassmorphism base dark
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4, // Tech/Code feel
          padding: '10px 24px',
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 0 12px rgba(210, 248, 2, 0.2)', // Neon glow
          },
        },
        containedPrimary: {
          background: '#D2F802',
          color: '#000000',
          '&:hover': {
            background: '#E2FC52',
            boxShadow: '0 0 20px rgba(210, 248, 2, 0.4)', // Intense Neon glow
          },
        },
        outlinedPrimary: {
          borderWidth: '1px',
          borderColor: '#D2F802',
          color: '#D2F802',
          '&:hover': {
            borderWidth: '1px',
            backgroundColor: 'rgba(210, 248, 2, 0.05)',
            boxShadow: '0 0 12px rgba(210, 248, 2, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#1E1E1E',
          backgroundImage: 'none',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          transition: 'border-color 0.3s ease, transform 0.3s ease',
          '&:hover': {
            borderColor: '#D2F802', // Highlight border on hover
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#18181B', // Darker menu
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 8,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          margin: '4px 8px',
          borderRadius: 4,
          '&:hover': {
            backgroundColor: 'rgba(210, 248, 2, 0.08)',
            color: '#D2F802',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(210, 248, 2, 0.16)',
            color: '#D2F802',
          },
        },
      },
    },
  },
});

export default theme;

