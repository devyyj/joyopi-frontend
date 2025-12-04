// src/pages/LottoResearch.jsx

import React, {useCallback, useEffect, useState} from 'react';
import {Box, Button, CircularProgress, Container, styled, Typography, Zoom} from '@mui/material';

// 1. 로또 번호 공 스타일링 (MUI 테마와 표준 로또 색상 활용)
// MUI의 styled 함수를 사용하여 컴포넌트 내부에서 동적으로 스타일을 적용합니다.
const LottoBall = styled(Box)(({theme, number}) => {
  // 표준 로또 번호 구간별 색상 설정 (한국 기준)
  let colorMap = {
    backgroundColor: theme.palette.primary.main, // 기본값: Acid Lime
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
    colorMap.backgroundColor = '#72C800'; // 초록색 (Acid Lime 계열로 대체 가능)
    colorMap.color = theme.palette.common.white;
  }

  return {
    ...colorMap,
    width: 60,
    height: 60,
    borderRadius: '50%', // 원형 공 모양
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 700,
    fontSize: '1.5rem',
    margin: '0 8px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)', // 공의 입체감
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
        // 모든 번호가 표시되면 생성 상태를 해제합니다.
        setIsGenerating(false);
      }
    }
  }, [isGenerating, lottoNumbers, displayCount]);


  return (
    <Container maxWidth="md" sx={{mt: 8, mb: 12, minHeight: '60vh'}}>
      <Typography variant="h3" component="h1" gutterBottom textAlign="center">
        연구소: 로또 번호 연구 {/* [변경] 페이지 제목 업데이트 */}
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph textAlign="center" sx={{mb: 5}}>
        가장 모던한 기술로 분석된 6개의 로또 번호 조합을 연구합니다. {/* [변경] 설명 업데이트 */}
      </Typography>

      {/* 로또 번호 공 표시 영역 */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={100}
        mb={6}
      >
        {lottoNumbers.map((number, index) => {
          // displayCount보다 index가 작을 때만 번호를 표시합니다.
          const showBall = index < displayCount;

          return (
            // Zoom 컴포넌트를 사용하여 번호가 뿅 나타나는 애니메이션 효과를 구현
            <Zoom
              key={index}
              in={showBall} // showBall 상태에 따라 애니메이션 실행
            >
              <LottoBall number={number}>
                {number}
              </LottoBall>
            </Zoom>
          );
        })}
      </Box>

      {/* 버튼 영역 */}
      <Box textAlign="center">
        <Button
          variant="contained"
          size="large"
          onClick={handleGenerate}
          disabled={isGenerating} // 생성 중일 때 버튼 비활성화
        >
          {isGenerating ? (
            <Box display="flex" alignItems="center">
              <CircularProgress size={20} color="inherit" sx={{mr: 1}}/>
              번호 연구 중... {/* [변경] 버튼 텍스트 업데이트 */}
            </Box>
          ) : (
            '번호 조합 연구 시작'
            )}
        </Button>
      </Box>
    </Container>
  );
}

export default LottoResearch;