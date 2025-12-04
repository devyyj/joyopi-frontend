// src/pages/NicknameResearch.jsx

import React from 'react';
import { Container, Typography } from '@mui/material';

/**
 * @title 닉네임 연구 페이지
 * @description 연구소 메뉴의 하위 기능으로, 닉네임 조합을 연구하는 기능을 제공합니다.
 */
function NicknameResearch() {
  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 12, minHeight: '60vh' }}>
      <Typography variant="h3" component="h1" gutterBottom>
        연구소: 닉네임 연구 {/* [변경] 페이지 제목 업데이트 */}
      </Typography>
      <Typography variant="body1">
        여기에 인공지능 기반의 새로운 닉네임 조합을 연구하는 로직과 UI가 들어갑니다. (경로: /lab/nickname) {/* [변경] 설명 업데이트 */}
      </Typography>
    </Container>
  );
}

export default NicknameResearch;