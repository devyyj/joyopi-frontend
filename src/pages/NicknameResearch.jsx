// src/pages/NicknameResearch.jsx

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Box, Button, CircularProgress, Container, keyframes, styled, Tooltip, Typography,} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

//==================================================================================
// 1. 닉네임 생성에 사용할 단어 데이터를 별도 파일에서 import
//==================================================================================
import {words} from '../data/words.js';

// 최대 기록 개수 설정
const MAX_HISTORY_COUNT = 10;
// 닉네임 글자당 표시 지연 시간 설정 (밀리초)
const NICKNAME_DISPLAY_DELAY = 200;
// 짠 효과 지속 시간 설정 (밀리초)
const COMPLETE_EFFECT_DURATION = 2000;


//==================================================================================
// 2. 헬퍼 함수 및 로직 함수 정의
//==================================================================================

/**
 * 랜덤 인덱스를 생성하는 헬퍼 함수입니다.
 * @param {number} max 배열의 길이
 * @returns {number} 랜덤 인덱스
 */
const getRandomIndex = (max) => Math.floor(Math.random() * max);


/**
 * @name generateRandomNicknameByWord
 * 닉네임 생성 규칙: '형용사 + 명사' 조합만 사용하여 랜덤 닉네임을 생성하는 함수입니다.
 * @returns {string} 생성된 닉네임 (띄어쓰기 포함)
 */
const generateRandomNicknameByWord = () => {
  // words 객체에서 adjectives와 nouns를 구조 분해 할당
  const {adjectives, nouns} = words;

  // 형용사 목록에서 무작위 단어 선택
  const adj = adjectives[getRandomIndex(adjectives.length)];

  // 명사 목록에서 무작위 단어 선택
  const noun = nouns[getRandomIndex(nouns.length)];

  // '형용사 + 명사' 형태로 조합하여 반환 (공백 포함)
  return `${adj} ${noun}`;
};


//==================================================================================
// 3. 닉네임 표시를 위한 스타일 및 애니메이션 정의
//==================================================================================

// '짠' 효과 (갑자기 확 커졌다가 서서히 원래대로 돌아오는 효과)
const completeEffectKeyframes = keyframes`
    0% { transform: scale(1); }
    10% { transform: scale(1.5); } /* 10% 지점에서 최대 크기 (확!) */
    100% { transform: scale(1); } /* 10% 이후 100%까지 서서히 원래 크기로 복귀 */
`;

/**
 * 최종 닉네임 표시에 사용되는 Typography 컴포넌트
 */
const AnimatedNicknameTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isCompleteEffect', // isCompleteEffect prop이 DOM으로 전달되는 것을 방지
})(({theme, isCompleteEffect}) => ({
  mb: 1,
  wordBreak: 'break-all',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  // 닉네임이 너무 길면 폰트 크기를 줄이도록 시도
  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
  // 짠 효과 적용: isCompleteEffect가 true일 때만 애니메이션 실행
  animation: isCompleteEffect ? `${completeEffectKeyframes} ${COMPLETE_EFFECT_DURATION}ms ease-out forwards` : 'none',
  willChange: 'transform', // 성능 최적화를 위해 transform 변경 예정 명시
}));


//==================================================================================
// 4. 기록 목록 컴포넌트 및 스타일 정의
//==================================================================================
// (HistoryNicknameBox 및 HistoryList 컴포넌트 내용은 변경 없음)
// ...

/**
 * 기록 목록의 개별 항목에 사용될 스타일 정의
 * UI 통일: LottoResearch와 유사하게 배경색과 테두리를 사용하도록 수정
 */
const HistoryNicknameBox = styled(Box)(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5, 2), // LottoResearch에 맞게 패딩 조정
  marginBottom: theme.spacing(0.5),
  border: `1px solid #F0F0F0`, // LottoResearch에 맞게 테두리 추가
  borderRadius: theme.spacing(1), // 모서리 둥글게
  backgroundColor: '#FFFFFF', // 배경색 추가
  transition: 'none',
}));


/**
 * @name HistoryList
 * 닉네임 연구 기록 목록을 렌더링하는 컴포넌트입니다.
 * @param {object} props
 * @param {string[]} props.history 생성된 닉네임 기록 배열
 */
const HistoryList = React.memo(({history}) => {
  if (history.length === 0) return null;

  return (
    <Box sx={{mt: 7, pt: 2.5, borderTop: '1px solid #EEE'}}> {/* UI 통일: 여백 조정 */}
      <Typography variant="h5" component="h2" gutterBottom textAlign="center" sx={{mb: 3}}> {/* UI 통일: h5로 변경 */}
        연구 기록
      </Typography>
      <Box p={1}>
        {history.map((name, index) => (
          <HistoryNicknameBox
            key={index}
          >
            {/* 기록 순번 표시 */}
            <Typography variant="body2" sx={{mr: 2, minWidth: '40px', fontWeight: 'bold', color: 'text.secondary'}}> {/* UI 통일: minWidth 및 bold 유지 */}
              #{history.length - index}
            </Typography>

            {/* 닉네임 (왼쪽 정렬) - 볼드체 제거 */}
            <Typography variant="body1" sx={{flexGrow: 1}}>
              {name}
            </Typography>

            {/* 기록된 닉네임의 길이 (오른쪽 정렬) */}
            <Typography variant="body2" color="text.secondary">
              ({name.length}자)
            </Typography>

          </HistoryNicknameBox>
        ))}
      </Box>
      {history.length >= MAX_HISTORY_COUNT && (
        <Typography variant="caption" color="text.secondary" textAlign="center" display="block" sx={{mt: 1}}>
          *최신 {MAX_HISTORY_COUNT}개의 기록만 유지됩니다.
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
  // 띄어쓰기 포함된 닉네임 ('행복한 사자'). 애니메이션을 위해 공백 포함 원본 유지
  const [nicknameWithSpace, setNicknameWithSpace] = useState('');
  // 애니메이션 진행 중 현재까지 화면에 표시된 닉네임
  const [displayedNickname, setDisplayedNickname] = useState('');
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false); // 생성 중 또는 애니메이션 진행 중
  const [history, setHistory] = useState([]); // 공백이 제거된 닉네임 기록
  // 닉네임 표시 완료 후 '짠' 효과 활성화 여부
  const [isCompleteEffect, setIsCompleteEffect] = useState(false);


  // 닉네임에서 공백을 제거한 최종 닉네임 (기록, 복사에 사용)
  const finalNickname = useMemo(() => {
    // displayedNickname을 기반으로 공백 제거
    // displayedNickname 자체가 이미 공백 없는 문자열이므로, 그대로 사용
    return displayedNickname;
  }, [displayedNickname]);


  /**
   * 닉네임을 생성하고 상태를 업데이트하는 함수입니다.
   */
  const handleGenerateNickname = useCallback(async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    // 새 생성 시작 시 '짠' 효과 초기화
    setIsCompleteEffect(false);
    setNicknameWithSpace(''); // 이전 닉네임 초기화
    setDisplayedNickname(''); // 애니메이션 표시 닉네임 초기화

    // 실제 백엔드 API 호출 시뮬레이션 (3초 지연 유지)
    await new Promise(resolve => setTimeout(resolve, 3000));

    const newNicknameWithSpace = generateRandomNicknameByWord();

    // 띄어쓰기를 제거한 최종 닉네임을 저장하여 애니메이션이 공백 없이 진행되도록 함
    const newNicknameWithoutSpace = newNicknameWithSpace.replace(/\s/g, '');

    // 공백 제거된 닉네임 저장 (useEffect가 이 값을 감지하고 애니메이션 시작)
    setNicknameWithSpace(newNicknameWithoutSpace);

    // isGenerating은 useEffect 내에서 애니메이션 완료 시 해제됨

  }, [isGenerating]);


  // 닉네임 한 글자씩 표시 애니메이션 효과
  useEffect(() => {
    if (nicknameWithSpace && isGenerating) {
      const originalText = nicknameWithSpace;
      const currentLength = displayedNickname.length;

      if (currentLength < originalText.length) {
        // NICKNAME_DISPLAY_DELAY 간격으로 다음 글자를 추가
        const timer = setTimeout(() => {
          setDisplayedNickname(originalText.substring(0, currentLength + 1));
        }, NICKNAME_DISPLAY_DELAY);

        return () => clearTimeout(timer); // 클린업 함수
      } else {
        // 애니메이션 완료: 마지막 글자 표시 후 대기 시간을 가진 후 '짠' 효과 시작

        // 마지막 글자 표시 애니메이션이 끝날 때까지 NICKNAME_DISPLAY_DELAY만큼 기다립니다.
        const delayTimer = setTimeout(() => {

          // '짠' 효과 시작
          setIsCompleteEffect(true);

          // '짠' 효과 지속 시간 후 상태 해제 및 기록 저장 [수정된 부분]
          const effectTimer = setTimeout(() => {
            setIsCompleteEffect(false);

            // [수정] '짠' 효과까지 완전히 종료된 후 기록 저장
            setHistory(prev => {
              const newHistory = [finalNickname, ...prev];
              return newHistory.slice(0, MAX_HISTORY_COUNT);
            });

            // 애니메이션 완료 후 생성 상태 해제
            setIsGenerating(false);
          }, COMPLETE_EFFECT_DURATION);

          return () => clearTimeout(effectTimer); // 클린업 함수

        }, NICKNAME_DISPLAY_DELAY);


        return () => clearTimeout(delayTimer); // 클린업 함수
      }
    }
    // setIsCompleteEffect는 상태 Setter이므로 의존성 배열에 포함하지 않아도 됩니다.
  }, [nicknameWithSpace, displayedNickname, isGenerating, finalNickname]);


  /**
   * 생성된 닉네임을 클립보드에 복사하는 함수입니다.
   */
  const handleCopyNickname = useCallback(async () => {
    // 복사 시점에는 finalNickname(공백 제거된 displayedNickname)을 사용
    if (finalNickname) {
      try {
        await navigator.clipboard.writeText(finalNickname);

        setTooltipOpen(true);
        setTimeout(() => setTooltipOpen(false), 1500); // 1.5초 후 툴팁 닫기
      } catch (err) {
        console.error('클립보드 복사 실패:', err);
      }
    }
  }, [finalNickname]);


  // 닉네임의 최종 길이 계산 (finalNickname 기준)
  const finalNicknameLength = useMemo(() => {
    return finalNickname.length;
  }, [finalNickname]);


  return (
    <Container maxWidth="sm" sx={{mt: 8, mb: 12, minHeight: '60vh'}}>
      {/* UI 통일: 메인 제목 및 부제 스타일을 LottoResearch에 맞게 변경 */}
      <Typography variant="h3" component="h1" gutterBottom textAlign="center"> {/* h4 -> h3 변경 */}
        닉네임 연구
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph textAlign="center" sx={{mb: 5}}> {/* body1 -> h6 변경, mb 조정 */}
        고급 알고리즘을 활용하여 가장 완벽한 조합의 닉네임을 연구합니다. {/* 3번 문구 적용 */}
      </Typography>

      <Box component="div">

        {/* 닉네임 표시 영역 */}
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight={120} // 높이 고정
          mb={6} // UI 통일: 여백 조정
        >
          {/* 닉네임 표시 로직: displayedNickname 사용 */}
          {isGenerating && !displayedNickname ? (
            // API 호출 단계: 로딩 스피너 표시
            <Box display="flex" flexDirection="column" alignItems="center">
              <CircularProgress size={40} sx={{mb: 1}}/>
            </Box>
          ) : displayedNickname ? (
            // 애니메이션 진행 중 또는 완료 상태: displayedNickname 표시
            <Box textAlign="center">
              {/* AnimatedNicknameTypography 컴포넌트 사용 */}
              <AnimatedNicknameTypography
                variant="h2"
                component="div"
                fontWeight="bold"
                color="primary.main"
                noWrap // 텍스트가 한 줄로 유지되도록 강제
                // '짠' 효과 활성화 여부를 props로 전달
                isCompleteEffect={isCompleteEffect}
              >
                {/* 공백이 제거된 닉네임을 애니메이션으로 표시 */}
                {displayedNickname}
              </AnimatedNicknameTypography>
            </Box>

          ) : (
            // 초기 상태 또는 생성 대기
            <Typography variant="h5" color="text.secondary" sx={{opacity: 0.7}}>
              닉네임 연구를 시작하세요.
            </Typography>
          )}
        </Box>


        {/* 버튼 영역 */}
        <Box
          display="flex"
          justifyContent="space-between"
          gap={2}
          sx={{
            flexDirection: {xs: 'column', sm: 'row'},
            maxWidth: 400,
            mx: 'auto',
            mb: 8, // UI 통일: 여백 조정
          }}
        >
          {/* 복사 버튼 */}
          <Box sx={{flexGrow: 1}}>
            <Tooltip
              title="복사 완료!"
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
                disabled={isGenerating || !finalNickname} // 애니메이션 중에는 비활성화
                startIcon={<ContentCopyIcon/>}
                size="large"
                color="secondary"
              >
                닉네임 복사
              </Button>
            </Tooltip>
          </Box>

          {/* 생성 버튼 (연구 시작 버튼) */}
          <Box sx={{flexGrow: 1}}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleGenerateNickname}
              disabled={isGenerating}
              size="large"
              color="primary"
            >
              {isGenerating ? (
                // 간결한 로딩 표시
                '연구 진행 중...'
              ) : (
                '연구 시작'
              )}
            </Button>
          </Box>
        </Box>

      </Box>

      {/* 이전 번호 기록 표시 영역 컴포넌트 호출 */}
      <HistoryList history={history}/>

    </Container>
  );
}

export default NicknameResearch;