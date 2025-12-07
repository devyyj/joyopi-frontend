// src/components/Footer.jsx

import React from 'react';
import { Box, Typography, Container, useTheme, Divider, Link } from '@mui/material';

/**
 * @title Web Service Footer Component
 * @description Minimalist footer for the research lab.
 */
function Footer() {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 8,
        px: 2,
        mt: 'auto',
        backgroundColor: 'background.default',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <Container maxWidth="lg">
        <Box
          display="flex"
          flexDirection={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'center', md: 'flex-start' }}
          textAlign={{ xs: 'center', md: 'left' }}
          gap={4}
        >
          {/* Brand */}
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', mb: 1 }}
            >
              Yopi<Box component="span" sx={{ color: theme.palette.primary.main }}>sode</Box>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
              Private Research Records & Digital Experiments.
              <br />Exploring the intersection of algorithm and serendipity.
            </Typography>
          </Box>

          {/* Links (Example) */}
          <Box display="flex" gap={4}>
            <Box>
              <Typography variant="subtitle2" color="text.primary" fontWeight={700} mb={2}>
                Research
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Link href="/lab/nickname" underline="hover" color="text.secondary" variant="body2">Nickname Analysis</Link>
                <Link href="/lab/lotto" underline="hover" color="text.secondary" variant="body2">Lotto Stochastic</Link>
                <Link href="/lab/food" underline="hover" color="text.secondary" variant="body2">Menu Optimization</Link>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.05)' }} />

        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" gap={2}>
          <Typography variant="caption" color="text.disabled">
            © {currentYear} Joyopi. All rights reserved.
          </Typography>
          <Typography variant="caption" color="text.disabled">
            v1.2.0 • Powered by Antigravity
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
