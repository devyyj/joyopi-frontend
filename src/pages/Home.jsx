// src/pages/Home.jsx

import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';

/**
 * @title 메인 페이지 (Home Page)
 * @description 서비스의 핵심 소개 및 CTA(Call to Action)를 포함하는 페이지입니다.
 */
function Home() {
  return (
    // Container: 콘텐츠의 최대 너비를 제한하여 가독성을 높입니다.
    <Container maxWidth="md" sx={{ mt: 8, mb: 12, minHeight: '60vh' }}>
      {/* minHeight: 페이지 콘텐츠가 적어도 이 높이를 가지도록 하여 Footer가 너무 올라오지 않게 방지 */}

      {/* 히어로 섹션 (Hero Section) */}
      <Box textAlign="center">
        <Typography variant="h2" component="h1" gutterBottom>
          개발자를 위한 최고의 백엔드 서비스
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          프로젝트 관리부터 배포 자동화까지, Joyopi와 함께 개발 과정을 단순화하세요.
        </Typography>

        {/* Call to Action 버튼 */}
        <Button variant="contained" size="large" sx={{ mt: 3, mr: 2 }}>
          지금 시작하기
        </Button>
        <Button variant="outlined" size="large" sx={{ mt: 3 }}>
          기능 둘러보기
        </Button>
      </Box>

      {/* 추가 콘텐츠 섹션 (예시) */}
      <Box sx={{ mt: 10 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          주요 특징
        </Typography>
        <Typography variant="body1">
          다양한 기술 스택을 지원하며, 최신 버전의 Spring Boot, Spring Security 설정을 자동으로 적용합니다.
        </Typography>
        {/* 실제 웹 서비스에서는 여기에 Feature 카드 컴포넌트 등이 배치됩니다. */}
      </Box>
    </Container>
  );
}

export default Home;