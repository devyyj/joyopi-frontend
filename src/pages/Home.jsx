// src/pages/Home.jsx

import React from 'react';
import { Container, Typography, Box, Button, Card, CardContent, Stack, Chip, Divider, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ScienceIcon from '@mui/icons-material/Science';

/**
 * @title 메인 페이지 (Home Page) - Research Lab Concept
 */
function Home() {
  const navigate = useNavigate();
  const theme = useTheme();

  const episodes = [
    {
      id: 1,
      title: 'Lexical Nomenclature',
      subtitle: '어휘 조합 기반 명명법 최적화',
      desc: '언어학적 빅데이터 코퍼스에서 추출된 400여 개의 데이터셋을 기반으로, 인지 부하를 최소화하고 독창성을 극대화하는 궁극의 닉네임을 생성합니다.',
      path: '/lab/nickname',
      tags: ['Algorithm', 'Naming'],
    },
    {
      id: 2,
      title: 'Stochastic Process',
      subtitle: '순수 난수 기반 확률 과정 모델링',
      desc: '1부터 45까지의 수 체계 내에서 발생하는 순수 난수의 패턴 및 확률 분포를 모델링하고, 시각적 스펙트럼으로 렌더링하여 무작위성의 본질을 탐구합니다.',
      path: '/lab/lotto',
      tags: ['Probability', 'Simulation'],
    },
    {
      id: 3,
      title: 'Menu Optimization',
      subtitle: '대중 선호도 기반 메뉴 최적화',
      desc: '128개의 광범위한 음식 데이터셋과 토너먼트 방식의 시뮬레이션을 통해, 사용자 개개인의 최적화된 선택 과정을 심층적으로 모델링합니다.',
      path: '/lab/food',
      tags: ['Selection', 'Tournament'],
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 12 }, mb: 12, minHeight: '80vh' }}>

      {/* 1. Hero Section */}
      <Box sx={{ mb: 16, textAlign: 'center', animation: 'fadeIn 1s ease-out' }}>
        <Chip
          icon={<ScienceIcon sx={{ fontSize: '1rem !important', color: theme.palette.common.black }} />}
          label="Research Lab v1.0"
          sx={{
            mb: 3,
            fontWeight: 700,
            bgcolor: 'primary.main',
            color: 'common.black',
            border: 'none',
            fontSize: '0.875rem',
            height: 32
          }}
        />
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontWeight: 800,
            letterSpacing: '-0.03em',
            mb: 3,
            fontSize: { xs: '3rem', md: '5rem' },
            lineHeight: 0.95,
          }}
        >
          Yopisode
          <br />
          <Box component="span" sx={{ color: 'text.secondary', fontWeight: 600 }}>Archived</Box> Records
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            maxWidth: '600px',
            mx: 'auto',
            lineHeight: 1.6,
            fontWeight: 400,
            fontSize: { xs: '1rem', md: '1.25rem' }
          }}
        >
          지극히 사적인 호기심에서 출발한 프론트엔드 연구 기록.<br />
          우리는 일상의 사소한 선택과 우연을 <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>알고리즘</Box>으로 재해석합니다.
        </Typography>
      </Box>

      {/* 2. Episode Cards (Grid Layout) */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 4,
          animation: 'slideUp 1s ease-out 0.2s backwards'
        }}
      >
        {episodes.map((episode) => (
          <Card
            key={episode.id}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'visible',
            }}
          >
            {/* Number Badge */}
            <Box
              sx={{
                position: 'absolute',
                top: -20,
                right: 20,
                fontSize: '4rem',
                fontWeight: 900,
                color: 'rgba(255,255,255,0.03)',
                zIndex: 0,
                lineHeight: 1,
                fontFamily: 'monospace'
              }}
            >
              0{episode.id}
            </Box>

            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 4, zIndex: 1 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="overline" color="primary.main" sx={{ fontWeight: 700, letterSpacing: '0.1em' }}>
                  EPISODE 0{episode.id}
                </Typography>
                <Typography variant="h5" component="h3" sx={{ fontWeight: 700, mt: 1, mb: 0.5 }}>
                  {episode.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {episode.subtitle}
                </Typography>
              </Box>

              <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4, flexGrow: 1, lineHeight: 1.6 }}>
                {episode.desc}
              </Typography>

              <Box sx={{ mt: 'auto' }}>
                <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                  {episode.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{
                        bgcolor: 'background.default',
                        borderRadius: '4px',
                        fontWeight: 500,
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'text.secondary'
                      }}
                    />
                  ))}
                </Stack>
                <Button
                  variant="outlined"
                  fullWidth
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate(episode.path)}
                  sx={{ py: 1.5 }}
                >
                  Enter Lab
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* 3. Footer Statement */}
      <Box sx={{ mt: 16, textAlign: 'center', animation: 'fadeIn 1s ease-out 0.5s backwards' }}>
        <Divider sx={{ mb: 8, maxWidth: '120px', mx: 'auto', borderColor: 'primary.main', borderWidth: 1, opacity: 0.3 }} />
        <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic', opacity: 0.7 }}>
          "This is not just a web service, but a <Box component="span" sx={{ fontWeight: 700, color: 'text.primary', borderBottom: `2px solid ${theme.palette.primary.main}` }}>private episode</Box> containing Yopi's intellectual curiosity."
        </Typography>
      </Box>

      {/* Global CSS for Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Container>
  );
}

export default Home;
