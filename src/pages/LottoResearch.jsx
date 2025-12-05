// src/pages/LottoResearch.jsx

import React, {useCallback, useEffect, useState} from 'react';
import {Box, Button, CircularProgress, Container, keyframes, styled, Typography, Zoom} from '@mui/material';

// 최대 기록 개수 설정
const MAX_HISTORY_COUNT = 10;
// 짠 효과 지속 시간 설정 (밀리초)
const COMPLETE_EFFECT_DURATION = 2000;
// 마지막 Zoom 애니메이션 완료를 기다릴 시간 (300ms 권장)
const ZOOM_COMPLETE_DELAY = 300;


// '짠' 효과 (갑자기 확 커졌다가 서서히 원래대로 돌아오는 효과)
const completeEffectKeyframes = keyframes`
    0% { transform: scale(1); }
    10% { transform: scale(1.5); } /* 10% 지점에서 최대 크기 (확!) */
    100% { transform: scale(1); } /* 10% 이후 100%까지 서서히 원래 크기로 복귀 */
`;

// 1. 로또 번호 공 스타일링 (MUI 테마와 표준 로또 색상 활용)
// MUI의 styled 함수를 사용하여 컴포넌트 내부에서 동적으로 스타일을 적용합니다.
const LottoBall = styled(Box, {
  // isCompleteEffect prop이 DOM으로 전달되는 것을 방지
  shouldForwardProp: (prop) => prop !== 'isCompleteEffect',
})(({theme, number, isCompleteEffect}) => { // isCompleteEffect prop 추가
                                            // 표준 로또 번호 구간별 색상 설정 (한국 기준)
  let colorMap = {
    backgroundColor: theme.palette.primary.main, // 기본값
    color: theme.palette.text.primary,
  };

  if (number >= 1 && number <= 10) {
    colorMap.backgroundColor = '#FBC400'; // 노란색
    colorMap.color = theme.palette.text.primary;
  } else if (number >= 11 && number <= 20) {
    colorMap.backgroundColor = '#69C8F8'; // 파란색
    colorMap.color = theme.palette.common.white;
  } else if (number >= 21 && number <= 30) {
    colorMap.backgroundColor = '#FF7272'; // 빨간색
    colorMap.color = theme.palette.common.white;
  } else if (number >= 31 && number <= 40) {
    colorMap.backgroundColor = '#AAAAAA'; // 회색
    colorMap.color = theme.palette.common.white;
  } else if (number >= 41 && number <= 45) {
    colorMap.backgroundColor = '#72C800'; // 초록색
    colorMap.color = theme.palette.common.white;
  }

  return {
    ...colorMap,
    width: 48,
    height: 48,
    borderRadius: '50%', // 원형 공 모양
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 700,
    fontSize: '1.2rem',
    margin: '0 4px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)', // 공의 입체감
    // 짠 효과 적용: isCompleteEffect가 true일 때만 애니메이션 실행
    animation: isCompleteEffect ? `${completeEffectKeyframes} ${COMPLETE_EFFECT_DURATION}ms ease-out forwards` : 'none',
    willChange: 'transform',
  };
});

// History 섹션에 사용될 작은 공 스타일 (변경 없음)
const HistoryLottoBall = styled(Box)(({theme, number}) => {
  // LottoBall에서 색상 로직만 재활용
  let colorMap = {};
  if (number >= 1 && number <= 10) {
    colorMap.backgroundColor = '#FBC400';
    colorMap.color = theme.palette.text.primary;
  } else if (number >= 11 && number <= 20) {
    colorMap.backgroundColor = '#69C8F8';
    colorMap.color = theme.palette.common.white;
  } else if (number >= 21 && number <= 30) {
    colorMap.backgroundColor = '#FF7272';
    colorMap.color = theme.palette.common.white;
  } else if (number >= 31 && number <= 40) {
    colorMap.backgroundColor = '#AAAAAA';
    colorMap.color = theme.palette.common.white;
  } else if (number >= 41 && number <= 45) {
    colorMap.backgroundColor = '#72C800';
    colorMap.color = theme.palette.common.white;
  }

  return {
    ...colorMap,
    width: 24,
    height: 24,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 600,
    fontSize: '0.8rem',
    margin: '0 2px',
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
  // 로또 공 표시 완료 후 '짠' 효과 활성화 여부
  const [isCompleteEffect, setIsCompleteEffect] = useState(false);


  // 2. 로또 번호 생성 로직
  const generateLottoNumbers = useCallback(() => {
    const uniqueNumbers = new Set();
    while (uniqueNumbers.size < 6) {
      // 1부터 45까지의 랜덤 정수 생성
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
    // 새 생성 시작 시 '짠' 효과 초기화
    setIsCompleteEffect(false);
    setLottoNumbers(newNumbers); // 최종 번호 저장
    setDisplayCount(0); // 표시할 번호 개수 초기화 (애니메이션 재시작)
  };

  // 4. 애니메이션 효과 (순차적 번호 표시)
  useEffect(() => {
    if (isGenerating && lottoNumbers.length > 0) {
      if (displayCount < 6) {
        // 0.5초 간격으로 displayCount를 증가시켜 번호를 하나씩 표시합니다.
        const timer = setTimeout(() => {
          setDisplayCount(prev => prev + 1);
        }, 500);

        return () => clearTimeout(timer); // 클린업 함수
      } else {
        // 모든 번호(6개)가 표시 완료된 시점

        // 마지막 Zoom 애니메이션 완료를 기다린 후 '짠' 효과 시작
        // MUI Zoom 컴포넌트의 기본 전환 시간(transition duration)을 고려하여 잠시 대기합니다.
        const zoomDelayTimer = setTimeout(() => {

          // '짠' 효과 시작
          setIsCompleteEffect(true);

          // '짠' 효과 지속 시간 후 상태 해제 및 기록 저장 [수정된 부분]
          const effectTimer = setTimeout(() => {
            setIsCompleteEffect(false);

            // [수정] 모든 애니메이션(Zoom + 짠 효과)이 끝난 시점에 기록 저장
            setHistory(prev => {
              const newHistory = [lottoNumbers, ...prev];
              return newHistory.slice(0, MAX_HISTORY_COUNT);
            });

            // 최종 생성 상태 해제
            setIsGenerating(false);
          }, COMPLETE_EFFECT_DURATION);

          return () => clearTimeout(effectTimer);

        }, ZOOM_COMPLETE_DELAY); // 300ms 대기

        return () => clearTimeout(zoomDelayTimer); // 클린업 함수
      }
    }
  }, [isGenerating, lottoNumbers, displayCount]); // lottoNumbers를 의존성 배열에 유지하여 기록 저장 시 최신 값을 사용

  /**
   * 기록 목록 렌더링 컴포넌트
   */
  const HistoryList = () => {
    if (history.length === 0) return null;

    return (
      <Box sx={{mt: 7, pt: 2.5, borderTop: '1px solid #EEE'}}> {/* UI 통일: 여백 조정 */}
        <Typography variant="h5" component="h2" gutterBottom textAlign="center" sx={{mb: 3}}>
          연구 기록
        </Typography>
        <Box p={1}>
          {history.map((numbers, index) => (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              py={1.5}
              px={2}
              mb={0.5}
              sx={{
                border: '1px solid #F0F0F0', // 연한 테두리 (유지)
                borderRadius: 1,
                backgroundColor: '#FFFFFF', // 배경색 (유지)
              }}
            >
              {/* 1. 기록 순번 표시 (고정 너비) */}
              <Typography variant="body2" sx={{mr: 2, minWidth: '40px', fontWeight: 'bold', color: 'text.secondary'}}>
                #{history.length - index}
              </Typography>

              {/* 2. 중앙 정렬을 위한 Wrapper Box: 남은 공간을 차지하고 내부 요소를 중앙 정렬 */}
              <Box display="flex" flexGrow={1} justifyContent="center">

                {/* 3. 로또 번호 공 Container */}
                <Box display="flex" flexWrap="wrap">
                  {/* 기록된 번호를 작은 공으로 표시 */}
                  {numbers.map((number, ballIndex) => (
                    <HistoryLottoBall key={ballIndex} number={number}>
                      {number}
                    </HistoryLottoBall>
                  ))}
                </Box>
              </Box>

              {/* 좌측 순번 텍스트와 동일한 너비를 가진 Spacer Box를 추가하여 시각적 중앙 정렬을 맞춥니다. */}
              <Box sx={{ml: 2, minWidth: '40px'}} />
            </Box>
          ))}
        </Box>
        {history.length >= MAX_HISTORY_COUNT && (
          <Typography variant="caption" color="text.secondary" textAlign="center" display="block" sx={{mt: 1}}>
            *최신 {MAX_HISTORY_COUNT}개의 기록만 유지됩니다.
          </Typography>
        )}
      </Box>
    );
  };


  return (
    <Container maxWidth="md" sx={{mt: 8, mb: 12, minHeight: '60vh'}}>
      {/* UI 통일: 메인 제목 및 부제 스타일 유지 (NicknameResearch를 여기에 맞춤) */}
      <Typography variant="h3" component="h1" gutterBottom textAlign="center">
        로또 번호 연구
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph textAlign="center" sx={{mb: 5}}>
        가장 모던한 기술로 분석된 6개의 로또 번호 조합을 연구합니다.
      </Typography>

      {/* 로또 번호 공 표시 영역 */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={100}
        mb={6}
      >
        {/*
          번호가 할당되지 않아도 6개의 자리를 모두 렌더링하여 레이아웃 안정성을 확보합니다.
        */}
        {Array(6).fill(null).map((_, index) => {
          const number = lottoNumbers[index];
          // 번호가 있고, 순서에 따라 표시될 때만 애니메이션 실행
          const showBall = index < displayCount && number !== null;

          // 번호가 아직 표시되지 않았거나 생성 중일 때 플레이스홀더를 렌더링
          if (!showBall && !number) {
            return (
              <LottoBall
                key={`main-ball-${index}`}
                number={null}
                // 플레이스홀더에는 효과를 적용하지 않음
                isCompleteEffect={false}
                sx={{
                  backgroundColor: '#EEEEEE',
                  color: 'transparent',
                  border: '1px solid #DDDDDD',
                  boxShadow: 'none',
                  opacity: 0.5,
                }}
              >
                &nbsp;
              </LottoBall>
            );
          }

          // 번호가 할당되었고, 순서에 따라 표시될 때 Zoom 애니메이션 적용
          return (
            <Zoom
              key={`main-zoom-${index}`}
              in={showBall}
            >
              {number !== null ? (
                <LottoBall
                  number={number}
                  // isCompleteEffect prop 전달
                  isCompleteEffect={isCompleteEffect}
                >
                  {number}
                </LottoBall>
              ) : (
                // 비상 플레이스홀더
                <LottoBall
                  key={`main-fallback-${index}`}
                  number={null}
                  // 비상 플레이스홀더에는 효과를 적용하지 않음
                  isCompleteEffect={false}
                  sx={{
                    backgroundColor: '#EEEEEE',
                    color: 'transparent',
                    border: '1px solid #DDDDDD',
                    boxShadow: 'none',
                    opacity: 0.5,
                  }}>
                  &nbsp;
                </LottoBall>
              )}
            </Zoom>
          );
        })}
      </Box>

      {/* 버튼 영역: NicknameResearch처럼 중앙 정렬 및 최대 너비 제한으로 통일 */}
      <Box
        sx={{
          textAlign: 'center',
          mb: 8, // UI 통일: 여백 조정
          maxWidth: 400, // UI 통일: 최대 너비 제한
          mx: 'auto', // UI 통일: 중앙 정렬
        }}
      >
        <Button
          fullWidth // UI 통일: 너비를 부모 컨테이너에 꽉 채우도록 설정
          variant="contained"
          size="large"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Box display="flex" alignItems="center" justifyContent="center">
              <CircularProgress size={20} color="inherit" sx={{mr: 1}}/>
              연구 진행 중...
            </Box>
          ) : (
            '연구 시작'
          )}
        </Button>
      </Box>

      {/* 이전 번호 기록 표시 영역 컴포넌트 호출 */}
      <HistoryList />

    </Container>
  );
}

export default LottoResearch;