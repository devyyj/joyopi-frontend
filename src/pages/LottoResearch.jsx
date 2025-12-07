// src/pages/LottoResearch.jsx

import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Container, keyframes, styled, Typography, Zoom, Paper } from '@mui/material';

// 최대 기록 개수 설정
const MAX_HISTORY_COUNT = 10;
// 짠 효과 지속 시간 설정 (밀리초)
const COMPLETE_EFFECT_DURATION = 2000;
// 마지막 Zoom 애니메이션 완료를 기다릴 시간 (300ms 권장)
const ZOOM_COMPLETE_DELAY = 300;


// '짠' 효과
const completeEffectKeyframes = keyframes`
    0% { transform: scale(1); filter: brightness(1) blur(0px); }
    10% { transform: scale(1.3); filter: brightness(1.5) blur(2px); } /* 10% 지점에서 트위스트 */
    100% { transform: scale(1); filter: brightness(1) blur(0px); }
`;

// 1. 로또 번호 공 스타일링
const LottoBall = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isCompleteEffect',
})(({ theme, number, isCompleteEffect }) => {

  // Dark mode optimized colors
  let bgColor = '#333';
  let textColor = '#fff';
  let borderColor = 'rgba(255,255,255,0.1)';

  if (number >= 1 && number <= 10) {
    bgColor = '#FFCC00'; // Yellow
    textColor = '#111';
    borderColor = '#FFCC00';
  } else if (number >= 11 && number <= 20) {
    bgColor = '#0066FF'; // Blue
    textColor = '#fff';
    borderColor = '#0066FF';
  } else if (number >= 21 && number <= 30) {
    bgColor = '#FF3333'; // Red
    textColor = '#fff';
    borderColor = '#FF3333';
  } else if (number >= 31 && number <= 40) {
    bgColor = '#999999'; // Grey
    textColor = '#111';
    borderColor = '#999999';
  } else if (number >= 41 && number <= 45) {
    bgColor = '#00CC33'; // Green
    textColor = '#111';
    borderColor = '#00CC33';
  }

  return {
    width: 60,
    height: 60,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 800,
    fontSize: '1.5rem',
    margin: '0 6px',
    backgroundColor: 'transparent', // Glass/Outline feel
    border: `3px solid ${number ? borderColor : 'rgba(255,255,255,0.1)'}`,
    color: number ? textColor : 'transparent',
    boxShadow: number ? `0 0 15px ${borderColor}80` : 'none', // Neon glow

    // Fill background for better visibility if needed, or keep outline style.
    // Let's use a solid background for readability in dark mode but with glow.
    background: number ? `linear-gradient(135deg, ${bgColor} 0%, ${theme.palette.grey[900]} 120%)` : 'transparent',

    animation: isCompleteEffect ? `${completeEffectKeyframes} ${COMPLETE_EFFECT_DURATION}ms ease-out forwards` : 'none',
    willChange: 'transform, filter',
    transition: 'all 0.3s ease',
  };
});

// History 섹션에 사용될 작은 공 스타일
const HistoryLottoBall = styled(Box)(({ theme, number }) => {
  let bgColor = '#333';
  let textColor = '#fff';

  if (number >= 1 && number <= 10) { bgColor = '#FFCC00'; textColor = '#111'; }
  else if (number >= 11 && number <= 20) { bgColor = '#0066FF'; textColor = '#fff'; }
  else if (number >= 21 && number <= 30) { bgColor = '#FF3333'; textColor = '#fff'; }
  else if (number >= 31 && number <= 40) { bgColor = '#999999'; textColor = '#111'; }
  else if (number >= 41 && number <= 45) { bgColor = '#00CC33'; textColor = '#111'; }

  return {
    width: 28,
    height: 28,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 700,
    fontSize: '0.85rem',
    margin: '0 3px',
    backgroundColor: bgColor,
    color: textColor,
    boxShadow: `0 0 5px ${bgColor}60`,
  };
});


/**
 * @title 로또 번호 연구 페이지
 * @description 연구소 메뉴의 하위 기능으로, 로또 번호 조합을 연구합니다.
 */
function LottoResearch() {
  const [lottoNumbers, setLottoNumbers] = useState(Array(6).fill(null));
  const [displayCount, setDisplayCount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState([]);
  const [isCompleteEffect, setIsCompleteEffect] = useState(false);


  // 2. 로또 번호 생성 로직
  const generateLottoNumbers = useCallback(() => {
    const uniqueNumbers = new Set();
    while (uniqueNumbers.size < 6) {
      const randomNumber = Math.floor(Math.random() * 45) + 1;
      uniqueNumbers.add(randomNumber);
    }
    return Array.from(uniqueNumbers).sort((a, b) => a - b);
  }, []);

  // 3. 번호 생성 및 애니메이션 시작 핸들러
  const handleGenerate = () => {
    if (isGenerating) return;

    const newNumbers = generateLottoNumbers();

    setIsGenerating(true);
    setIsCompleteEffect(false);
    setLottoNumbers(newNumbers);
    setDisplayCount(0);
  };

  // 4. 애니메이션 효과
  useEffect(() => {
    if (isGenerating && lottoNumbers.length > 0) {
      if (displayCount < 6) {
        const timer = setTimeout(() => {
          setDisplayCount(prev => prev + 1);
        }, 120); // Faster generation for tech feel

        return () => clearTimeout(timer);
      } else {
        const zoomDelayTimer = setTimeout(() => {
          setIsCompleteEffect(true);

          const effectTimer = setTimeout(() => {
            setIsCompleteEffect(false);

            setHistory(prev => {
              const newHistory = [lottoNumbers, ...prev];
              return newHistory.slice(0, MAX_HISTORY_COUNT);
            });

            setIsGenerating(false);
          }, COMPLETE_EFFECT_DURATION);
          return () => clearTimeout(effectTimer);

        }, ZOOM_COMPLETE_DELAY);
        return () => clearTimeout(zoomDelayTimer);
      }
    }
  }, [isGenerating, lottoNumbers, displayCount]);

  /**
   * 기록 목록 렌더링 컴포넌트
   */
  const HistoryList = () => {
    if (history.length === 0) return null;

    return (
      <Box sx={{ mt: 8, pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Typography variant="h6" component="h2" gutterBottom textAlign="center" sx={{ mb: 3, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Historical Data
        </Typography>
        <Box p={0}>
          {history.map((numbers, index) => (
            <Paper
              elevation={0}
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                py: 2,
                px: 3,
                mb: 1.5,
                bgcolor: 'background.paper',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 2,
              }}
            >
              <Typography variant="caption" sx={{ mr: 3, minWidth: '40px', fontWeight: 'bold', color: 'primary.main', opacity: 0.8 }}>
                #{history.length - index}
              </Typography>

              <Box display="flex" flexGrow={1} justifyContent="center" flexWrap="wrap" gap={1}>
                {numbers.map((number, ballIndex) => (
                  <HistoryLottoBall key={ballIndex} number={number}>
                    {number}
                  </HistoryLottoBall>
                ))}
              </Box>

              <Box sx={{ ml: 2, minWidth: '40px' }} />
            </Paper>
          ))}
        </Box>
        {history.length >= MAX_HISTORY_COUNT && (
          <Typography variant="caption" color="text.disabled" textAlign="center" display="block" sx={{ mt: 2 }}>
            *Limited to last {MAX_HISTORY_COUNT} records
          </Typography>
        )}
      </Box>
    );
  };


  return (
    <Container maxWidth="md" sx={{ mt: { xs: 8, md: 10 }, mb: 12, minHeight: '60vh' }}>
      <Box textAlign="center" mb={10}>
        <Typography variant="overline" color="primary.main" fontWeight={700} sx={{ letterSpacing: '0.2em' }}>
          Laboratory #02
        </Typography>
        <Typography variant="h3" component="h1" fontWeight={800} gutterBottom sx={{ mt: 1 }}>
          Stochastic Process
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
          6개의 독립 변수에 대한 무작위 추출 시뮬레이션
        </Typography>
      </Box>

      {/* 로또 번호 공 표시 영역 */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        minHeight={120}
        mb={8}
        gap={2}
      >
        {Array(6).fill(null).map((_, index) => {
          const number = lottoNumbers[index];
          const showBall = index < displayCount && number !== null;

          if (!showBall && !number) {
            return (
              <LottoBall
                key={`main-ball-${index}`}
                number={null}
                isCompleteEffect={false}
              >
              </LottoBall>
            );
          }

          return (
            <Zoom key={`main-zoom-${index}`} in={showBall}>
              <Box> {/* Wrap in Box to avoid ref issues with styled component if any */}
                <LottoBall
                  number={number}
                  isCompleteEffect={isCompleteEffect}
                >
                  {number}
                </LottoBall>
              </Box>
            </Zoom>
          );
        })}
      </Box>

      {/* 버튼 영역 */}
      <Box
        sx={{
          textAlign: 'center',
          mb: 8,
          maxWidth: 300,
          mx: 'auto',
        }}
      >
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleGenerate}
          disabled={isGenerating}
          sx={{ height: 56, fontSize: '1.1rem' }}
        >
          {isGenerating ? (
            <Box display="flex" alignItems="center" justifyContent="center">
              <CircularProgress size={24} color="inherit" sx={{ mr: 1.5 }} />
              Processing...
            </Box>
          ) : (
            'Generate Sequence'
          )}
        </Button>
      </Box>

      <HistoryList />

    </Container>
  );
}

export default LottoResearch;
