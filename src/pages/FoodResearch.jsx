// src/pages/FoodResearch.jsx

import React, {useCallback, useEffect, useState} from 'react';
import {Box, Button, Card, CardActionArea, CardContent, CardMedia, CircularProgress, Container, Fade, keyframes, styled, Typography, Zoom, ToggleButtonGroup, ToggleButton, useTheme, IconButton} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import UndoIcon from '@mui/icons-material/Undo'; // 돌아가기 버튼 아이콘 추가

// 음식 데이터 가져오기
import {foods} from '../data/foods.js';

//==================================================================================
// 1. 상수 및 스타일 정의
//==================================================================================

// 최대 기록 개수 설정
const MAX_HISTORY_COUNT = 1000; // 기록 구조 변경에 따라 충분히 큰 값으로 설정
// 짠 효과 지속 시간 설정 (밀리초)
const COMPLETE_EFFECT_DURATION = 2000;
// 사용 가능한 토너먼트 강수 목록
const AVAILABLE_ROUNDS = [16, 32, 64, 128]; //

// '짠' 효과 (갑자기 확 커졌다가 서서히 원래대로 돌아오는 효과 - 기존 파일과 동일)
const completeEffectKeyframes = keyframes`
    0% { transform: scale(1); }
    10% { transform: scale(1.5); }
    100% { transform: scale(1); }
`;

// 선택 카드 스타일
const ChoiceCard = styled(Card)(({theme}) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
    borderColor: theme.palette.primary.main,
  },
}));

// 최종 결과 텍스트 스타일 (애니메이션 포함)
const WinnerTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isCompleteEffect',
})(({theme, isCompleteEffect}) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  // 짠 효과 적용
  animation: isCompleteEffect ? `${completeEffectKeyframes} ${COMPLETE_EFFECT_DURATION}ms ease-out forwards` : 'none',
  willChange: 'transform',
}));

// 기록 목록의 개별 항목 스타일 (UI 통일)
const HistoryFoodBox = styled(Box)(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5, 2),
  marginBottom: theme.spacing(0.5),
  border: `1px solid #F0F0F0`,
  borderRadius: theme.spacing(1),
  backgroundColor: '#FFFFFF',
}));


//==================================================================================
// 2. 헬퍼 컴포넌트: 이미지 처리
//==================================================================================

/**
 * @name FoodImage
 * @description jpg로 먼저 시도하고, 실패(onError) 시 png로, 둘 다 실패 시 아이콘을 보여주는 컴포넌트
 */
const FoodImage = ({name, height = 200}) => {
  const [imgSrc, setImgSrc] = useState(`/food_images/${name}.jpg`);
  const [isError, setIsError] = useState(false);

  // 이미지 로드 에러 핸들러
  const handleError = () => {
    // jpg에서 에러가 났다면 png로 변경 시도
    if (imgSrc.endsWith('.jpg')) {
      setImgSrc(`/food_images/${name}.png`);
    } else {
      // png도 실패했다면 에러 상태 true (아이콘 표시)
      setIsError(true);
    }
  };

  // name이 바뀌면 이미지 경로 초기화 (jpg부터 다시 시작)
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
          bgcolor: '#f5f5f5',
          color: 'text.secondary'
        }}
      >
        <RestaurantMenuIcon sx={{fontSize: 60, opacity: 0.5}}/>
      </Box>
    );
  }

  return (
    <CardMedia
      component="img"
      // height prop 대신 sx의 height 속성을 사용하여 반응형 값 처리
      image={imgSrc}
      alt={name}
      onError={handleError}
      sx={{objectFit: 'cover', height: height}}
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
  // 테마를 사용하기 위해 useTheme 훅 추가
  const theme = useTheme();

  // 게임 상태: 'idle' (대기), 'loading' (준비중), 'playing' (진행중), 'finished' (완료)
  const [gameState, setGameState] = useState('idle');

  // 라운드 전환 중 여부 (중복 클릭 방지)
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 토너먼트 강수 선택 상태 (기본값 16강)
  const [selectedRound, setSelectedRound] = useState(16);

  // 토너먼트 데이터 관리
  const [currentRoundList, setCurrentRoundList] = useState([]); // 현재 라운드 대진표
  const [nextRoundList, setNextRoundList] = useState([]);       // 다음 라운드 진출자 목록
  const [currentPairIndex, setCurrentPairIndex] = useState(0);  // 현재 대결 중인 인덱스 (0, 2, 4...)

  // 결과 및 효과 관리
  const [winner, setWinner] = useState(null);
  const [isCompleteEffect, setIsCompleteEffect] = useState(false);
  // 기록 구조: { roundLabel: string, pairIndex: number, foodA: string, foodB: string, winner: string }[]
  const [history, setHistory] = useState([]);


  /**
   * 토너먼트 강수 선택 핸들러
   */
  const handleRoundChange = (event, newRound) => {
    // 유효한 값일 때만 상태 업데이트
    if (newRound !== null) {
      setSelectedRound(newRound);
    }
  };


  /**
   * 게임 시작 (연구 시작) 핸들러
   * @param {number} roundSize 시작할 강수 크기 (16, 32, 64, 128)
   */
  const handleStartResearch = useCallback((roundSize) => {
    setGameState('loading');

    // 새로운 게임 시작 시 기록 초기화
    setHistory([]);

    // 연구 준비 시뮬레이션 (1.5초)
    setTimeout(() => {
      // 전체 음식 목록 복사 후 셔플
      const shuffled = [...foods].sort(() => 0.5 - Math.random());

      // 선택된 강수 개수만큼 자르기
      const size = Math.min(roundSize, foods.length);
      const selectedFoods = shuffled.slice(0, size);

      setCurrentRoundList(selectedFoods);
      setNextRoundList([]);
      setCurrentPairIndex(0);
      setWinner(null);
      setGameState('playing');
    }, 1500);
  }, []);


  /**
   * 현재 라운드 정보 텍스트 반환 (예: 16강, 8강, 결승)
   */
  const getRoundLabel = (listLength) => {
    const remaining = listLength || currentRoundList.length;
    if (remaining === 2) return "결승전";
    return `${remaining}강`;
  };


  /**
   * 음식 선택 핸들러
   * @param {object} selectedFood 선택된 음식 객체
   */
  const handleSelectFood = (selectedFood) => {
    // 트랜지션 중이거나 게임이 종료된 상태라면 클릭 무시
    if (isTransitioning || gameState !== 'playing') return;

    const leftFood = currentRoundList[currentPairIndex];
    const rightFood = currentRoundList[currentPairIndex + 1];

    // 기록 추가: 선택 정보를 history에 저장
    const newHistoryEntry = {
      roundLabel: getRoundLabel(currentRoundList.length),                                // 현재 라운드 (예: 16강)
      pairIndex: (currentPairIndex / 2) + 1,                                            // 대결 순번 (예: 1)
      foodA: leftFood.name,                                                             // 왼쪽 음식 이름
      foodB: rightFood.name,                                                            // 오른쪽 음식 이름
      winner: selectedFood.name,                                                        // 선택된 음식 이름
    };
    // 가장 최근 기록이 위에 오도록 prepend
    setHistory(prev => [newHistoryEntry, ...prev]);


    // 선택된 음식을 다음 라운드 리스트에 추가
    const newNextRoundList = [...nextRoundList, selectedFood];
    setNextRoundList(newNextRoundList);

    // 현재 라운드의 다음 대결로 이동 (2칸씩 이동)
    const nextIndex = currentPairIndex + 2;

    // 현재 라운드의 모든 대결이 끝났는지 확인
    if (nextIndex >= currentRoundList.length) {
      // 라운드 종료

      if (newNextRoundList.length === 1) {
        // [결승 종료] 최종 우승자 결정
        finishTournament(newNextRoundList[0]);
      } else {
        // [다음 라운드 진출] (16강 -> 8강 -> 4강...)

        // 트랜지션 시작: 카드 클릭을 비활성화
        setIsTransitioning(true);

        // 잠시 딜레이를 주어 UI가 자연스럽게 전환되도록 함 (300ms)
        setTimeout(() => {
          setCurrentRoundList(newNextRoundList); // 승자들을 현재 라운드로 설정
          setNextRoundList([]);                  // 다음 라운드 리스트 초기화
          setCurrentPairIndex(0);                // 인덱스 초기화

          // 트랜지션 종료: 카드 클릭 재활성화
          setIsTransitioning(false);
        }, 2000);
      }
    } else {
      // [현재 라운드 진행 중] 다음 쌍 보여주기
      setCurrentPairIndex(nextIndex);
    }
  };

  /**
   * [추가] 기록 목록에서 특정 단계로 돌아가기
   * @param {number} historyIndex 돌아가고자 하는 기록의 인덱스 (0이 최신)
   */
  const handleGoBack = (historyIndex) => {
    // 돌아가려는 인덱스까지의 기록(선택)만 남기고 나머지는 제거
    const remainingHistory = history.slice(historyIndex);

    // 남은 기록들을 사용하여 처음부터 다시 시뮬레이션

    // 1. 초기 상태 설정 (게임을 시작한 상태와 동일)
    setGameState('loading');
    setHistory(remainingHistory); // 기록은 돌아가려는 지점까지만 남김

    // 이전에 시작했던 라운드 크기 (selectedRound)로 초기 목록 재생성
    const roundSize = currentRoundList.length > 0 ? currentRoundList.length : selectedRound;

    // 전체 음식 목록 복사 후 셔플 (초기 시작과 동일하게)
    const shuffled = [...foods].sort(() => 0.5 - Math.random());
    const initialFoods = shuffled.slice(0, roundSize);

    let currentList = initialFoods;
    let nextList = [];
    let currentPair = 0;

    // 2. 남아있는 기록을 순회하며 상태 재구성
    remainingHistory.reverse().forEach(record => {
      // 현재 라운드 목록의 길이가 1이라면 이미 최종 우승자
      if (currentList.length === 1) return;

      const nextIndex = currentPair + 2;

      // 다음 라운드 리스트에 승자 추가
      const winnerFood = currentList.find(f => f.name === record.winner);
      if (winnerFood) {
        nextList.push(winnerFood);
      }

      // 현재 라운드의 모든 대결이 끝났는지 확인 (다음 라운드로 넘어갈 때)
      if (nextIndex >= currentList.length) {
        // 라운드 종료, 다음 라운드 목록을 현재 목록으로 설정
        currentList = nextList;
        nextList = [];
        currentPair = 0;
      } else {
        // 현재 라운드 진행 중, 다음 쌍으로 인덱스 이동
        currentPair = nextIndex;
      }
    });

    // 3. 재구성된 최종 상태 적용
    setWinner(null);
    setCurrentRoundList(currentList);
    setNextRoundList(nextList);
    setCurrentPairIndex(currentPair);
    setGameState('playing');
  };


  /**
   * 토너먼트 종료 및 결과 저장 처리
   */
  const finishTournament = (finalFood) => {
    setWinner(finalFood);
    setGameState('finished');

    // 1. 화면 전환 후 '짠' 효과 시작
    setTimeout(() => {
      setIsCompleteEffect(true);

      // 2. 효과 종료 후 상태 해제
      setTimeout(() => {
        setIsCompleteEffect(false);
      }, COMPLETE_EFFECT_DURATION);
    }, 300); // 줌 애니메이션 딜레이
  };


  // 렌더링 헬퍼: 대기 화면
  const renderIdle = () => (
    <Box textAlign="center" mb={8} maxWidth={600} mx="auto">
      <Typography variant="h6" gutterBottom sx={{mb: 2}}>
        연구 시작 강수를 선택하세요.
      </Typography>

      {/* 라운드 선택 토글 버튼 */}
      <ToggleButtonGroup
        value={selectedRound}
        exclusive
        onChange={handleRoundChange}
        aria-label="tournament round selection"
        sx={{mb: 4, flexWrap: 'wrap'}}
      >
        {AVAILABLE_ROUNDS.map(round => (
          <ToggleButton
            key={round}
            value={round}
            sx={{px: 3, py: 1}}
          >
            {round}강
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {/* 연구 시작 버튼 */}
      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={() => handleStartResearch(selectedRound)}
      >
        {selectedRound}강 연구 시작
      </Button>
    </Box>
  );

  // 렌더링 헬퍼: 로딩 화면
  const renderLoading = () => (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight={300} mb={6}>
      <CircularProgress size={50} sx={{mb: 3}} />
      <Typography variant="h6" color="text.secondary">
        음식 데이터 분석 및 대진표 생성 중...
      </Typography>
    </Box>
  );

  // 렌더링 헬퍼: 진행 화면 (토너먼트)
  const renderPlaying = () => {
    // isTransitioning 상태 확인
    const isDisabled = isTransitioning;

    if (isDisabled) {
      // 트랜지션 중일 때는 카드 렌더링을 완전히 생략하고 텍스트만 표시
      return (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight={400} // 카드 높이와 비슷하게 설정하여 레이아웃 흔들림 최소화
          mb={6}
        >
          <Typography variant="h4" color="primary.light" fontWeight="bold">
            다음 라운드 준비 중...
          </Typography>
          <Typography variant="body1" color="text.secondary">
            잠시만 기다려주세요.
          </Typography>
        </Box>
      );
    }

    // isTransitioning이 false일 때만 카드와 대결 정보를 렌더링
    const leftFood = currentRoundList[currentPairIndex];
    const rightFood = currentRoundList[currentPairIndex + 1];

    if (!leftFood || !rightFood) return null; // 에러 방지

    // 이미지 높이: 모바일에서 300px, 그 이상에서 240px
    const imageResponsiveHeight = { xs: 300, sm: 240 };

    return (
      <Box mb={6}>
        <Typography variant="h4" color="primary" fontWeight="bold" textAlign="center" sx={{mb: 4}}>
          {getRoundLabel()}
          <Typography component="span" variant="body1" color="text.secondary" sx={{ml: 2}}>
            ({(currentPairIndex / 2) + 1} / {currentRoundList.length / 2})
          </Typography>
        </Typography>

        <Box
          display="flex"
          justifyContent="center"
          alignItems="stretch"
          gap={{xs: 2, md: 4}}
          // 작은 화면에서도 'row'를 유지하도록 수정하여 가로 배치 강제
          flexDirection="row"
        >
          {/* 왼쪽 음식 카드 */}
          <Box flex={1} sx={{minWidth: {xs: 120, sm: 200}}}>
            <Fade in={true} key={leftFood.id}>
              <ChoiceCard elevation={4}>
                <CardActionArea
                  onClick={() => handleSelectFood(leftFood)}
                  sx={{height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch'}}
                  disabled={isDisabled}
                >
                  {/* 반응형 높이 적용 */}
                  <FoodImage name={leftFood.name} height={imageResponsiveHeight} />

                  <CardContent sx={{flexGrow: 1, textAlign: 'center'}}>
                    <Typography variant="h5" component="div" fontWeight="bold" gutterBottom>
                      {leftFood.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {leftFood.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </ChoiceCard>
            </Fade>
          </Box>

          {/* VS 표시 */}
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography
              // VS 텍스트: 모바일에서 h6, sm 이상에서 h4로 줄임
              variant="h4"
              fontWeight="900"
              color={'text.disabled'}
              sx={{ fontSize: { xs: theme.typography.h6.fontSize, sm: theme.typography.h4.fontSize } }}
            >
              VS
            </Typography>
          </Box>

          {/* 오른쪽 음식 카드 */}
          <Box flex={1} sx={{minWidth: {xs: 120, sm: 200}}}>
            <Fade in={true} key={rightFood.id}>
              <ChoiceCard elevation={4}>
                <CardActionArea
                  onClick={() => handleSelectFood(rightFood)}
                  sx={{height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch'}}
                  disabled={isDisabled}
                >
                  {/* 반응형 높이 적용 */}
                  <FoodImage name={rightFood.name} height={imageResponsiveHeight} />

                  <CardContent sx={{flexGrow: 1, textAlign: 'center'}}>
                    <Typography variant="h5" component="div" fontWeight="bold" gutterBottom>
                      {rightFood.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
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
    <Box textAlign="center" mb={8}>
      <Zoom in={true}>
        <Box>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            최종 분석 결과
          </Typography>

          <Box sx={{maxWidth: 300, mx: 'auto', mb: 3, borderRadius: 4, overflow: 'hidden', boxShadow: 3}}>
            {/* 반응형 높이 적용 (결과 화면은 모바일에서도 크게 유지) */}
            <FoodImage name={winner.name} height={300} />
          </Box>

          <WinnerTypography
            variant="h3"
            gutterBottom
            isCompleteEffect={isCompleteEffect}
          >
            {winner.name}
          </WinnerTypography>

          <Typography variant="body1" color="text.secondary" paragraph>
            {winner.description}
          </Typography>
        </Box>
      </Zoom>

      <Button
        variant="contained"
        size="large"
        // 게임 종료 후 다시 시작 버튼 클릭 시 'idle' 상태로 돌아가 강수 선택 화면으로 이동
        onClick={() => setGameState('idle')}
        sx={{mt: 4, minWidth: 200}}
      >
        다시 연구하기
      </Button>
    </Box>
  );

  // 렌더링 헬퍼: 히스토리 목록
  const HistoryList = () => {
    if (history.length === 0) return null;

    // 테마 색상 사용
    const roundColor = theme.palette.primary.dark; // #A6C700
    const winnerColor = theme.palette.primary.main; // #D2F802
    const primaryColor = theme.palette.primary.main; // #D2F802

    // 반응형 폰트 크기 설정: 모바일(xs)은 caption, md 이상은 body2
    const normalTextFontSize = theme.typography.body2.fontSize;
    const smallTextFontSize = theme.typography.caption.fontSize;
    const responsiveFontSize = { xs: smallTextFontSize, md: normalTextFontSize };

    return (
      <Box sx={{mt: 7, pt: 2.5, borderTop: '1px solid #EEE'}}>
        <Typography variant="h5" component="h2" gutterBottom textAlign="center" sx={{mb: 3}}>
          연구 기록
        </Typography>
        <Box p={1}>
          {history.map((record, index) => (
            <HistoryFoodBox
              key={index}
              // flexWrap을 'nowrap'으로 설정하여 줄바꿈을 강제로 막음
              sx={{justifyContent: 'space-between', flexWrap: 'nowrap', py: 1, overflowX: 'auto'}}
            >
              {/* 좌측: 라운드 정보 ('n강') */}
              <Box sx={{width: '50px', textAlign: 'left', flexShrink: 0, mr: {xs: 0.5, md: 1}}}>
                <Typography component="span" fontWeight="bold" sx={{ color: roundColor, whiteSpace: 'nowrap', fontSize: responsiveFontSize }}>
                  {record.roundLabel}
                </Typography>
              </Box>

              {/* 중앙: 대결 (A vs B) - 'vs'를 중심으로 정확히 중앙 정렬 */}
              <Box
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minWidth: 0,
                }}
              >
                {/* 1. Food A (vs를 향해 오른쪽 정렬) */}
                <Box sx={{flex: 1, textAlign: 'right', mr: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                  <Typography component="span" fontWeight="bold" sx={{ color: record.winner === record.foodA ? winnerColor : 'inherit', fontSize: responsiveFontSize }}>
                    {record.foodA}
                  </Typography>
                </Box>

                {/* 2. VS (중앙에 고정) */}
                <Typography component="span" color="text.disabled" sx={{flexShrink: 0, px: 0.5, fontSize: responsiveFontSize}}>
                  vs
                </Typography>

                {/* 3. Food B (vs를 향해 왼쪽 정렬) */}
                <Box sx={{flex: 1, textAlign: 'left', ml: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                  <Typography component="span" fontWeight="bold" sx={{ color: record.winner === record.foodB ? winnerColor : 'inherit', fontSize: responsiveFontSize }}>
                    {record.foodB}
                  </Typography>
                </Box>

              </Box>

              {/* 우측: 돌아가기 기능 */}
              <Box sx={{width: '50px', textAlign: 'right', flexShrink: 0, ml: {xs: 0.5, md: 1}}}>
                <IconButton
                  size="small"
                  onClick={() => handleGoBack(index)}
                  // 마지막 기록(가장 최근 선택)일 때는 비활성화
                  disabled={index === 0}
                  sx={{p: 0.5, color: primaryColor}}
                  aria-label={`돌아가기 (${record.roundLabel} ${record.pairIndex}번째 대결 전)`}
                >
                  <UndoIcon fontSize="small" />
                </IconButton>
              </Box>
            </HistoryFoodBox>
          ))}
        </Box>
        {history.length > 0 && (
          <Typography variant="caption" color="text.secondary" textAlign="center" display="block" sx={{mt: 1}}>
            *마지막 선택을 제외한 기록을 눌러 해당 시점으로 돌아갈 수 있습니다.
          </Typography>
        )}
      </Box>
    );
  };


  return (
    <Container maxWidth="md" sx={{mt: 8, mb: 12, minHeight: '60vh'}}>
      {/* 타이틀 영역 - 다른 페이지와 통일 */}
      <Typography variant="h3" component="h1" gutterBottom textAlign="center">
        메뉴 선정 연구
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph textAlign="center" sx={{mb: 5}}>
        토너먼트 분석 기법을 통해 현재 가장 선호하는 메뉴를 도출합니다.
      </Typography>

      {/* 상태에 따른 메인 컨텐츠 렌더링 */}
      {gameState === 'idle' && renderIdle()}
      {gameState === 'loading' && renderLoading()}
      {gameState === 'playing' && renderPlaying()}
      {gameState === 'finished' && renderFinished()}

      {/* 하단 기록 영역 */}
      <HistoryList />

    </Container>
  );
}

export default FoodResearch;