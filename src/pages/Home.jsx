// src/pages/Home.jsx

import React from 'react';
import { Container, Typography, Box, Button, CircularProgress, Alert } from '@mui/material';

/**
 * @title 메인 페이지 (Home Page)
 */
function Home() {
  const [message, setMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleCallApi = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch('/api/test/hello');
      if (!response.ok) {
        throw new Error('API 호출 실패');
      }
      const data = await response.text();
      setMessage(data);
    } catch (err) {
      setError(err.message || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 12, minHeight: '60vh' }}>
      <Box textAlign="center">
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          홈 페이지
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          새로운 프로젝트를 시작하세요. 배포 환경(Nginx)과 로컬(Vite Proxy) 환경을 지원합니다.
        </Typography>

        <Box sx={{ mt: 4, p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleCallApi}
            disabled={loading}
            sx={{ px: 4, py: 1.5, borderRadius: '20px' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : '백엔드 API 호출'}
          </Button>

          {message && (
            <Alert severity="success" sx={{ mt: 3, justifyContent: 'center' }}>
              응답 메시지: <strong>{message}</strong>
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 3, justifyContent: 'center' }}>
              {error}
            </Alert>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default Home;