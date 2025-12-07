// src/pages/FoodResearch.jsx

import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, Card, CardActionArea, CardContent, CardMedia, CircularProgress, Container, Fade, keyframes, styled, Typography, Zoom, ToggleButtonGroup, ToggleButton, useTheme, IconButton, Paper, Chip } from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import UndoIcon from '@mui/icons-material/Undo';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// 음식 데이터 가져오기
import { foods } from '../data/foods.js';

//==================================================================================
// 1. 상수 및 스타일 정의
//==================================================================================

const MAX_HISTORY_COUNT = 1000;
const COMPLETE_EFFECT_DURATION = 1500;
const AVAILABLE_ROUNDS = [16, 32, 64, 128];

const completeEffectKeyframes = keyframes`
    0% { transform: scale(1); filter: brightness(1) drop-shadow(0 0 0 rgba(210, 248, 2, 0)); }
    50% { transform: scale(1.1); filter: brightness(1.2) drop-shadow(0 0 20px rgba(210, 248, 2, 0.5)); }
    100% { transform: scale(1); filter: brightness(1) drop-shadow(0 0 10px rgba(210, 248, 2, 0.2)); }
`;

const ChoiceCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  backgroundColor: theme.palette.background.paper,
  border: '1px solid rgba(255,255,255,0.05)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 12px 20px -5px rgba(0, 0, 0, 0.5), 0 0 15px -3px ${theme.palette.primary.main}40`, // Colored glow
    borderColor: theme.palette.primary.main,
  },
}));

const WinnerTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isCompleteEffect',
})(({ theme, isCompleteEffect }) => ({
  fontWeight: 800,
  color: theme.palette.primary.main,
  textShadow: '0 0 20px rgba(210, 248, 2, 0.3)',
  animation: isCompleteEffect ? `${completeEffectKeyframes} ${COMPLETE_EFFECT_DURATION}ms ease-out forwards` : 'none',
  willChange: 'transform, filter',
}));

//==================================================================================
// 2. 헬퍼 컴포넌트: 이미지 처리
//==================================================================================

const FoodImage = ({ name, height = 240, rounded = false }) => {
  const [imgSrc, setImgSrc] = useState(`/food_images/${name}.jpg`);
  const [isError, setIsError] = useState(false);

  const handleError = () => {
    if (imgSrc.endsWith('.jpg')) {
      setImgSrc(`/food_images/${name}.png`);
    } else {
      setIsError(true);
    }
  };

  useEffect(() => {
    setImgSrc(`/food_images/${name}.jpg`);
    setIsError(false);
  }, [name]);

  if (isError) {
    return (
      <Box
        sx={{
          height: height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'action.hover',
          color: 'text.secondary',
          borderRadius: rounded ? 2 : 0,
        }}
      >
        <RestaurantMenuIcon sx={{ fontSize: 60, opacity: 0.2 }} />
      </Box>
    );
  }

  return (
    <CardMedia
      component="img"
      image={imgSrc}
      alt={name}
      onError={handleError}
      sx={{
        objectFit: 'cover',
        height: height,
        borderRadius: rounded ? 2 : 0
      }}
    />
  );
};


//==================================================================================
// 3. 메인 컴포넌트
//==================================================================================

/**
 * @title 음식 메뉴 연구 페이지 (이상형 월드컵)
 * @description 사용자 취향을 분석하여 최적의 메뉴를 도출하는 토너먼트 방식의 페이지
 */
function FoodResearch() {
  const theme = useTheme();

  // 게임 상태: 'idle' (대기), 'loading' (준비중), 'playing' (진행중), 'finished' (완료)
  const [gameState, setGameState] = useState('idle');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedRound, setSelectedRound] = useState(16);

  const [initialRoundList, setInitialRoundList] = useState([]); // [NEW] Store initial seeds

  const [currentRoundList, setCurrentRoundList] = useState([]);
  const [nextRoundList, setNextRoundList] = useState([]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);

  const [winner, setWinner] = useState(null);
  const [isCompleteEffect, setIsCompleteEffect] = useState(false);
  const [history, setHistory] = useState([]);


  const handleRoundChange = (event, newRound) => {
    if (newRound !== null) {
      setSelectedRound(newRound);
    }
  };


  const handleStartResearch = useCallback((roundSize) => {
    setGameState('loading');
    setHistory([]);

    setTimeout(() => {
      const shuffled = [...foods].sort(() => 0.5 - Math.random());
      const size = Math.min(roundSize, foods.length);
      const selectedFoods = shuffled.slice(0, size);

      setInitialRoundList(selectedFoods); // [NEW] Save for replay
      setCurrentRoundList(selectedFoods);
      setNextRoundList([]);
      setCurrentPairIndex(0);
      setWinner(null);
      setGameState('playing');
    }, 1500);
  }, []);


  const getRoundLabel = (listLength) => {
    const remaining = listLength || currentRoundList.length;
    if (remaining === 2) return "Final Match";
    return `Round of ${remaining}`;
  };


  const handleSelectFood = (selectedFood) => {
    if (isTransitioning || gameState !== 'playing') return;

    const leftFood = currentRoundList[currentPairIndex];
    const rightFood = currentRoundList[currentPairIndex + 1];

    const newHistoryEntry = {
      roundLabel: getRoundLabel(currentRoundList.length),
      pairIndex: (currentPairIndex / 2) + 1,
      foodA: leftFood.name,
      foodB: rightFood.name,
      winner: selectedFood.name,
    };
    setHistory(prev => [newHistoryEntry, ...prev]);


    const newNextRoundList = [...nextRoundList, selectedFood];
    setNextRoundList(newNextRoundList);

    const nextIndex = currentPairIndex + 2;

    if (nextIndex >= currentRoundList.length) {
      if (newNextRoundList.length === 1) {
        finishTournament(newNextRoundList[0]);
      } else {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentRoundList(newNextRoundList);
          setNextRoundList([]);
          setCurrentPairIndex(0);
          setIsTransitioning(false);
        }, 1500);
      }
    } else {
      setCurrentPairIndex(nextIndex);
    }
  };

  const handleGoBack = (historyIndex = 0) => {
    // If called without arguments (e.g. main button), undo just one step (index 0)
    // If called from history list, undo to that specific point

    const remainingHistory = history.slice(historyIndex + 1); // Remove the undone steps

    setGameState('loading');
    setHistory(remainingHistory);

    // [FIX] Use stored initial seeds instead of reshuffling
    const currentListTorestore = [...initialRoundList];

    let currentList = currentListTorestore;
    let nextList = [];
    let currentPair = 0;

    // Replay history
    remainingHistory.reverse().forEach(record => {
      if (currentList.length === 1) return;

      const nextIndex = currentPair + 2;

      // Find the winner from the current list based on history
      // Note: We match by name. 
      const winnerFood = currentList.find(f => f.name === record.winner);

      if (winnerFood) {
        nextList.push(winnerFood);
      }

      if (nextIndex >= currentList.length) {
        // End of round
        currentList = nextList;
        nextList = [];
        currentPair = 0;
      } else {
        currentPair = nextIndex;
      }
    });

    setWinner(null);
    setCurrentRoundList(currentList);
    setNextRoundList(nextList);
    setCurrentPairIndex(currentPair);
    setGameState('playing');
  };


  const finishTournament = (finalFood) => {
    setWinner(finalFood);
    setGameState('finished');

    setTimeout(() => {
      setIsCompleteEffect(true);
      setTimeout(() => {
        setIsCompleteEffect(false);
      }, COMPLETE_EFFECT_DURATION);
    }, 300);
  };


  // 렌더링 헬퍼: 대기 화면
  const renderIdle = () => (
    <Box textAlign="center" mb={12} maxWidth={600} mx="auto">
      <Box mb={6}>
        <Typography variant="overline" color="primary.main" fontWeight={700} sx={{ letterSpacing: '0.2em' }}>
          Laboratory #03
        </Typography>
        <Typography variant="h3" component="h1" fontWeight={800} gutterBottom sx={{ mt: 1 }}>
          Menu Optimization
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Identify your optimal preference through tournament selection.
        </Typography>
      </Box>

      <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'text.primary' }}>
        Select Tournament Size
      </Typography>

      <ToggleButtonGroup
        value={selectedRound}
        exclusive
        onChange={handleRoundChange}
        aria-label="tournament round selection"
        sx={{
          mb: 4,
          gap: 1,
          '& .MuiToggleButton-root': {
            border: '1px solid rgba(255,255,255,0.1) !important',
            borderRadius: '8px !important',
            color: 'text.secondary',
            px: 3,
            py: 1.5,
            '&.Mui-selected': {
              bgcolor: 'primary.main',
              color: 'common.black',
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }
          }
        }}
      >
        {AVAILABLE_ROUNDS.map(round => (
          <ToggleButton key={round} value={round}>
            {round}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={() => handleStartResearch(selectedRound)}
        sx={{ minWidth: 200, height: 56, fontSize: '1.1rem' }}
      >
        Start Analysis
      </Button>
    </Box>
  );

  // 렌더링 헬퍼: 로딩 화면
  const renderLoading = () => (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight={400} mb={6}>
      <CircularProgress size={60} thickness={4} sx={{ mb: 4 }} />
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Organizing Data...
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Constructing tournament bracket
      </Typography>
    </Box>
  );

  // 렌더링 헬퍼: 진행 화면
  const renderPlaying = () => {
    const isDisabled = isTransitioning;

    if (isDisabled) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight={500}
          mb={6}
        >
          <CircularProgress size={40} thickness={4} sx={{ mb: 3 }} />
          <Typography variant="h5" color="text.primary" fontWeight="bold">
            Preparing Next Round
          </Typography>
        </Box>
      );
    }

    const leftFood = currentRoundList[currentPairIndex];
    const rightFood = currentRoundList[currentPairIndex + 1];

    if (!leftFood || !rightFood) return null;

    const roundLabel = getRoundLabel();
    const isFinal = roundLabel === "Final Match";

    return (
      <Box mb={6}>
        <Box textAlign="center" mb={4}>
          {isFinal && <Chip label="CHAMPIONSHIP MATCH" color="primary" sx={{ fontWeight: 800, mb: 2 }} />}
          <Typography variant="h4" color={isFinal ? "primary" : "text.primary"} fontWeight="900" sx={{ letterSpacing: '-0.02em' }}>
            {roundLabel}
          </Typography>
          <Typography component="div" variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Match {(currentPairIndex / 2) + 1} of {currentRoundList.length / 2}
          </Typography>
        </Box>

        <Box
          display="flex"
          justifyContent="center"
          alignItems="stretch"
          gap={{ xs: 2, md: 6 }}
          flexDirection="row"
        >
          {/* Left Card */}
          <Box flex={1} sx={{ minWidth: 0, maxWidth: 400 }}>
            <Fade in={true} key={leftFood.id} timeout={500}>
              <ChoiceCard elevation={0}>
                <CardActionArea
                  onClick={() => handleSelectFood(leftFood)}
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch', p: 0 }}
                  disabled={isDisabled}
                >
                  <FoodImage name={leftFood.name} />

                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                    <Typography variant="h5" component="div" fontWeight="bold" gutterBottom>
                      {leftFood.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8 }}>
                      {leftFood.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </ChoiceCard>
            </Fade>
          </Box>

          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={3} sx={{ position: 'relative', zIndex: 10 }}>
            <Box sx={{
              bgcolor: 'background.default',
              borderRadius: '50%',
              width: { xs: 40, sm: 60 },
              height: { xs: 40, sm: 60 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <Typography
                variant="h5"
                fontWeight="900"
                color="text.secondary"
                sx={{ fontSize: { xs: '1rem', sm: '1.5rem' }, fontStyle: 'italic' }}
              >
                VS
              </Typography>
            </Box>

            {/* [NEW] Main Step Undo Button */}
            {history.length > 0 && (
              <Zoom in={true}>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="small"
                  startIcon={<UndoIcon />}
                  onClick={() => handleGoBack(0)}
                  sx={{
                    borderRadius: 4,
                    px: 2,
                    color: 'text.secondary',
                    borderColor: 'rgba(255,255,255,0.1)',
                    '&:hover': {
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      bgcolor: 'rgba(210, 248, 2, 0.05)'
                    }
                  }}
                >
                  Undo
                </Button>
              </Zoom>
            )}
          </Box>

          {/* Right Card */}
          <Box flex={1} sx={{ minWidth: 0, maxWidth: 400 }}>
            <Fade in={true} key={rightFood.id} timeout={500}>
              <ChoiceCard elevation={0}>
                <CardActionArea
                  onClick={() => handleSelectFood(rightFood)}
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch', p: 0 }}
                  disabled={isDisabled}
                >
                  <FoodImage name={rightFood.name} />

                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                    <Typography variant="h5" component="div" fontWeight="bold" gutterBottom>
                      {rightFood.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8 }}>
                      {rightFood.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </ChoiceCard>
            </Fade>
          </Box>
        </Box>
      </Box>
    );
  };

  // 렌더링 헬퍼: 결과 화면
  const renderFinished = () => (
    <Box textAlign="center" mb={8} mt={4}>
      <Zoom in={true} timeout={800}>
        <Box>
          <Box mb={4}>
            <EmojiEventsIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="overline" color="text.secondary" display="block" sx={{ letterSpacing: '0.2em' }}>
              OPTIMAL SELECTION
            </Typography>
          </Box>

          <Box sx={{ maxWidth: 360, mx: 'auto', mb: 4, borderRadius: 4, overflow: 'hidden', boxShadow: 3, border: `2px solid ${theme.palette.primary.main}` }}>
            <FoodImage name={winner.name} height={360} />
          </Box>

          <WinnerTypography
            variant="h2"
            gutterBottom
            isCompleteEffect={isCompleteEffect}
            sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}
          >
            {winner.name}
          </WinnerTypography>

          <Typography variant="h6" color="text.secondary" paragraph sx={{ maxWidth: 600, mx: 'auto', mb: 6, fontWeight: 400 }}>
            {winner.description}
          </Typography>
        </Box>
      </Zoom>

      <Button
        variant="contained"
        size="large"
        onClick={() => setGameState('idle')}
        sx={{ minWidth: 200, height: 56 }}
      >
        Restart Analysis
      </Button>
    </Box>
  );

  // 렌더링 헬퍼: 히스토리 목록
  const HistoryList = () => {
    if (history.length === 0) return null;

    return (
      <Box sx={{ mt: 8, pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Typography variant="h6" component="h2" gutterBottom textAlign="center" sx={{ mb: 3, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Decision History
        </Typography>
        <Box p={0}>
          {history.map((record, index) => (
            <Paper
              elevation={0}
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 1.5,
                px: 2,
                mb: 1,
                bgcolor: 'background.paper',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 2
              }}
            >
              <Box sx={{ width: '80px', flexShrink: 0 }}>
                <Typography variant="caption" fontWeight="bold" color="primary.main">
                  {record.roundLabel}
                </Typography>
              </Box>

              <Box
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minWidth: 0,
                }}
              >
                <Box sx={{ flex: 1, textAlign: 'right', mr: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <Typography variant="body2" fontWeight={record.winner === record.foodA ? 700 : 400} color={record.winner === record.foodA ? 'text.primary' : 'text.disabled'}>
                    {record.foodA}
                  </Typography>
                </Box>

                <Typography variant="caption" color="text.disabled" sx={{ px: 1 }}>vs</Typography>

                <Box sx={{ flex: 1, textAlign: 'left', ml: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <Typography variant="body2" fontWeight={record.winner === record.foodB ? 700 : 400} color={record.winner === record.foodB ? 'text.primary' : 'text.disabled'}>
                    {record.foodB}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ width: '40px', textAlign: 'right', flexShrink: 0 }}>
                <IconButton
                  size="small"
                  onClick={() => handleGoBack(index)}
                  disabled={index === 0}
                  sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                >
                  <UndoIcon fontSize="small" />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
        {history.length > 0 && (
          <Typography variant="caption" color="text.disabled" textAlign="center" display="block" sx={{ mt: 2 }}>
            *Click undo to revert decision
          </Typography>
        )}
      </Box>
    );
  };


  return (
    <Container maxWidth="md" sx={{ mt: { xs: 8, md: 10 }, mb: 12, minHeight: '60vh' }}>
      {gameState === 'idle' && renderIdle()}
      {gameState === 'loading' && renderLoading()}
      {gameState === 'playing' && renderPlaying()}
      {gameState === 'finished' && renderFinished()}

      <HistoryList />
    </Container>
  );
}

export default FoodResearch;
