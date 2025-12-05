// src/pages/Home.jsx

import React from 'react';
import { Container, Typography, Box, Divider, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

/**
 * @title 메인 페이지 (Home Page)
 * @description 웹 서비스의 목표와 주요 연구 과제를 진지하고 학술적인 톤으로 소개합니다.
 */
function Home() {
  const navigate = useNavigate(); // useNavigate 훅 사용

  /**
   * @description 주어진 경로로 페이지를 이동하는 핸들러 함수를 반환합니다.
   * @param {string} path - 이동할 라우팅 경로 ('/lab/nickname' 또는 '/lab/lotto')
   */
  const navigateToLab = (path) => () => {
    navigate(path);
  };

  return (
    // Container: 콘텐츠의 최대 너비를 제한하여 가독성을 높입니다.
    <Container maxWidth="md" sx={{ mt: 8, mb: 12, minHeight: '60vh' }}>
      {/* 1. 웹 서비스 소개 (Hero Section) */}
      <Box textAlign="center" sx={{ mb: 10 }}>
        {/* H1: 지적 탐구의 전당 */}
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{ mb: 2 }} // fontWeight="bold" 제거
        >
          지적 탐구의 전당: 요피랜드 연구소
        </Typography>

        {/* H5: 연구소의 목적 */}
        <Typography variant="h5" color="text.secondary" paragraph sx={{ lineHeight: 1.8 }}>
          본 연구소는 최첨단 프론트엔드 아키텍처 위에서 구현된 심오한 알고리즘과 통계적 모델의 집합체입니다. 저희는 데이터 무작위성의 본질과 사용자 경험 설계의 미학을 교차 분석하는 미지의 영역을 탐색하는 데 주력하고 있습니다. 모든 결과물은 엄격한 실험 과정을 거쳐 도출된 지적 산물입니다.
        </Typography>
      </Box>

      <Divider sx={{ mb: 8 }} />

      {/* 2. 주요 연구 과제 소개 섹션 */}
      <Box sx={{ mt: 10 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 5, borderLeft: '4px solid #D2F802', pl: 2 }}>
          주요 연구 과제
        </Typography>

        {/* 2-1. 닉네임 연구 과제 */}
        <Box sx={{ mb: 7 }}>
          <Typography variant="h5" component="h3" gutterBottom sx={{ mb: 1.5 }}>
            제1 연구과제: 어휘 조합 기반 명명법 최적화 연구 (Lexical Nomenclature Optimization)
          </Typography>
          <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.7 }}>
            언어학적 빅데이터 코퍼스에서 추출된 400여 개의 형용사 및 명사 데이터셋을 기반으로, 인간의 인지 부하를 최소화하고 독창성을 극대화하는 최적의 명명법 조합을 탐구합니다. 생성된 닉네임은 단순한 무작위성을 넘어선 의미론적 연결 고리의 잠재력을 내포하고 있으며, 문자열 출력의 시간적 지연은 알고리즘의 깊은 연산 과정을 시뮬레이션합니다.
          </Typography>
          {/* 닉네임 연구 바로가기 버튼 */}
          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={navigateToLab('/lab/nickname')}
            >
              닉네임 연구 시작
            </Button>
          </Box>
        </Box>

        {/* 2-2. 로또 번호 연구 과제 */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" component="h3" gutterBottom sx={{ mb: 1.5 }}>
            제2 연구과제: 순수 난수 기반 확률 과정 모델링 연구 (Stochastic Process Modeling)
          </Typography>
          <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.7 }}>
            1부터 45까지의 수 체계 내에서 발생하는 순수 난수의 패턴 및 확률 분포를 모델링하고, 그 결과를 고속으로 시뮬레이션하는 연구입니다. 생성된 각 표본은 시각적 미디어를 통해 로또 공 색상 스펙트럼을 활용하여 고해상도로 렌더링됩니다. 이 과정은 프론트엔드 환경에서 무작위성의 본질을 탐구하는 중대한 실험이며, 애니메이션 '짠' 효과는 결과 도출의 완결성을 상징합니다.
          </Typography>
          {/* 로또 번호 연구 바로가기 버튼 */}
          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={navigateToLab('/lab/lotto')}
            >
              로또 번호 연구 시작
            </Button>
          </Box>
        </Box>
      </Box>

      {/* 3. 하단 강조 문구 영역 (라임색 경계선으로 은은한 포인트 적용) */}
      <Box sx={{ mt: 10, textAlign: 'center' }}>
        <Box
          sx={(theme) => ({
            py: 2, // 상하 패딩 추가
            px: 3, // 좌우 패딩 추가
            borderTop: `2px solid ${theme.palette.primary.dark}`, // primary.dark(#A6C700) 상단 경계선
            borderBottom: `2px solid ${theme.palette.primary.dark}`, // primary.dark(#A6C700) 하단 경계선
            display: 'inline-block', // 내용만큼 너비 조정
            maxWidth: '100%',
          })}
        >
          <Typography
            variant="h6"
            color="text.primary" // 텍스트 색상은 검은색으로 유지하여 가독성 확보
          >
            "우리는 단순한 유틸리티가 아닌, 지적 호기심의 새로운 경계를 탐색합니다."
          </Typography>
        </Box>
      </Box>

    </Container>
  );
}

export default Home;