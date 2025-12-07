// src/pages/NicknameResearch.jsx

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Button, CircularProgress, Container, keyframes, styled, Tooltip, Typography, Paper } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

//==================================================================================
// 1. 닉네임 생성에 사용할 단어 데이터를 별도 파일에서 import
//==================================================================================
import { words } from '../data/words.js';

// 최대 기록 개수 설정
const MAX_HISTORY_COUNT = 10;
// 닉네임 글자당 표시 지연 시간 설정 (밀리초)
const NICKNAME_DISPLAY_DELAY = 150;
// 짠 효과 지속 시간 설정 (밀리초)
const COMPLETE_EFFECT_DURATION = 1500;


//==================================================================================
// 2. 헬퍼 함수 및 로직 함수 정의
//==================================================================================

const getRandomIndex = (max) => Math.floor(Math.random() * max);

const generateRandomNicknameByWord = () => {
  const { adjectives, nouns } = words;
  const adj = adjectives[getRandomIndex(adjectives.length)];
  const noun = nouns[getRandomIndex(nouns.length)];
  return `${adj} ${noun}`;
};


//==================================================================================
// 3. 닉네임 표시를 위한 스타일 및 애니메이션 정의
//==================================================================================

// '짠' 효과 (Typewriter finish effect)
const completeEffectKeyframes = keyframes`
    0% { transform: scale(1); text-shadow: 0 0 10px rgba(210, 248, 2, 0.5); }
    50% { transform: scale(1.1); text-shadow: 0 0 30px rgba(210, 248, 2, 0.8), 0 0 60px rgba(210, 248, 2, 0.4); color: #fff; }
    100% { transform: scale(1); text-shadow: 0 0 15px rgba(210, 248, 2, 0.3); }
`;

const AnimatedNicknameTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isCompleteEffect',
})(({ theme, isCompleteEffect }) => ({
  mb: 1,
  wordBreak: 'break-all',
  overflow: 'visible', // Allow glow to spill over
  textOverflow: 'clip',
  fontWeight: 800,
  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
  color: theme.palette.primary.main,
  textShadow: isCompleteEffect ? 'none' : '0 0 10px rgba(210, 248, 2, 0.3)', // Basic glow

  // 짠 효과 적용
  animation: isCompleteEffect ? `${completeEffectKeyframes} ${COMPLETE_EFFECT_DURATION}ms ease-out forwards` : 'none',
  willChange: 'transform, text-shadow',
  transition: 'all 0.3s ease'
}));


//==================================================================================
// 4. 기록 목록 컴포넌트 및 스타일 정의
//==================================================================================

const HistoryList = React.memo(({ history }) => {
  if (history.length === 0) return null;

  return (
    <Box sx={{ mt: 8, pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      <Typography variant="h6" component="h2" gutterBottom textAlign="center" sx={{ mb: 3, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        Result History
      </Typography>
      <Box p={0}>
        {history.map((name, index) => (
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
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateX(4px)',
                borderColor: 'primary.main'
              }
            }}
          >
            <Typography variant="caption" sx={{ mr: 2, minWidth: '40px', fontWeight: 'bold', color: 'primary.main', opacity: 0.8 }}>
              #{history.length - index}
            </Typography>

            <Typography variant="body1" sx={{ flexGrow: 1, fontWeight: 500, color: '#fff' }}>
              {name}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              ({name.length} chars)
            </Typography>
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
});
HistoryList.displayName = 'HistoryList';


//==================================================================================
// 5. 메인 컴포넌트: 닉네임 연구 페이지
//==================================================================================

/**
 * @title 닉네임 연구 페이지
 * @description 단어 조합 기반의 랜덤 닉네임 생성 기능을 제공합니다.
 */
function NicknameResearch() {
  const [nicknameWithSpace, setNicknameWithSpace] = useState('');
  const [displayedNickname, setDisplayedNickname] = useState('');
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState([]);
  const [isCompleteEffect, setIsCompleteEffect] = useState(false);


  const finalNickname = useMemo(() => {
    return displayedNickname;
  }, [displayedNickname]);


  const handleGenerateNickname = useCallback(async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    setIsCompleteEffect(false);
    setNicknameWithSpace('');
    setDisplayedNickname('');

    // 실제 백엔드 API 호출 시뮬레이션 (Wait time reduced for better UX)
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newNicknameWithSpace = generateRandomNicknameByWord();
    const newNicknameWithoutSpace = newNicknameWithSpace.replace(/\s/g, '');

    setNicknameWithSpace(newNicknameWithoutSpace);

  }, [isGenerating]);


  // 닉네임 한 글자씩 표시 애니메이션 효과
  useEffect(() => {
    if (nicknameWithSpace && isGenerating) {
      const originalText = nicknameWithSpace;
      const currentLength = displayedNickname.length;

      if (currentLength < originalText.length) {
        const timer = setTimeout(() => {
          setDisplayedNickname(originalText.substring(0, currentLength + 1));
        }, NICKNAME_DISPLAY_DELAY);

        return () => clearTimeout(timer);
      } else {
        const delayTimer = setTimeout(() => {
          setIsCompleteEffect(true);

          const effectTimer = setTimeout(() => {
            setIsCompleteEffect(false);

            setHistory(prev => {
              const newHistory = [finalNickname, ...prev];
              return newHistory.slice(0, MAX_HISTORY_COUNT);
            });

            setIsGenerating(false);
          }, COMPLETE_EFFECT_DURATION);

          return () => clearTimeout(effectTimer);

        }, NICKNAME_DISPLAY_DELAY);


        return () => clearTimeout(delayTimer);
      }
    }
  }, [nicknameWithSpace, displayedNickname, isGenerating, finalNickname]);


  const handleCopyNickname = useCallback(async () => {
    if (finalNickname) {
      try {
        await navigator.clipboard.writeText(finalNickname);

        setTooltipOpen(true);
        setTimeout(() => setTooltipOpen(false), 1500);
      } catch (err) {
        console.error('클립보드 복사 실패:', err);
      }
    }
  }, [finalNickname]);


  return (
    <Container maxWidth="sm" sx={{ mt: { xs: 8, md: 10 }, mb: 12, minHeight: '60vh' }}>
      <Box textAlign="center" mb={10}>
        <Typography variant="overline" color="primary.main" fontWeight={700} sx={{ letterSpacing: '0.2em' }}>
          Laboratory #01
        </Typography>
        <Typography variant="h3" component="h1" fontWeight={800} gutterBottom sx={{ mt: 1 }}>
          Lexical Nomenclature
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
          인지 부하를 최소화하는 어휘 조합 알고리즘
        </Typography>
      </Box>

      <Box component="div">

        {/* 닉네임 표시 영역 */}
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight={160}
          mb={6}
        >
          {isGenerating && !displayedNickname ? (
            <Box display="flex" flexDirection="column" alignItems="center">
              <CircularProgress size={40} color="primary" thickness={5} />
              <Typography variant="caption" sx={{ mt: 2, color: 'text.secondary', letterSpacing: '0.1em' }} >PROCESSING DATASET...</Typography>
            </Box>
          ) : displayedNickname ? (
            <Box textAlign="center">
              <AnimatedNicknameTypography
                variant="h2"
                component="div"
                fontWeight="bold"
                noWrap
                isCompleteEffect={isCompleteEffect}
              >
                {displayedNickname}
              </AnimatedNicknameTypography>
            </Box>

          ) : (
            <Typography variant="h5" color="text.disabled" sx={{ opacity: 0.5, fontStyle: 'italic' }}>
              Initialized. Ready to generate.
            </Typography>
          )}
        </Box>


        {/* 버튼 영역 */}
        <Box
          display="flex"
          justifyContent="center"
          gap={2}
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
            maxWidth: 400,
            mx: 'auto',
            mb: 8,
          }}
        >
          {/* 복사 버튼 */}
          <Box sx={{ flex: 1 }}>
            <Tooltip
              title="Copied!"
              open={tooltipOpen}
              onClose={() => setTooltipOpen(false)}
              placement="top"
              disableFocusListener
              disableHoverListener
              disableTouchListener
            >
              <Button
                fullWidth
                variant="outlined"
                onClick={handleCopyNickname}
                disabled={isGenerating || !finalNickname}
                startIcon={<ContentCopyIcon />}
                size="large"
                sx={{ height: 56 }}
              >
                Copy
              </Button>
            </Tooltip>
          </Box>

          {/* 생성 버튼 */}
          <Box sx={{ flex: 1.5 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleGenerateNickname}
              disabled={isGenerating}
              size="large"
              sx={{ height: 56, fontSize: '1.1rem' }}
            >
              {isGenerating ? 'Analyzing...' : 'Generate New'}
            </Button>
          </Box>
        </Box>

      </Box>

      <HistoryList history={history} />

    </Container>
  );
}

export default NicknameResearch;
