// src/theme/theme.js

import { createTheme } from '@mui/material/styles';

// createTheme 함수를 사용하여 기본 테마를 정의합니다.
// 여기에 프로젝트의 주요 색상, 타이포그래피, 컴포넌트 오버라이드 등을 설정합니다.
const theme = createTheme({
  // 주 색상, 보조 색상 등 프로젝트 팔레트를 정의합니다.
  palette: {
    primary: {
      main: '#1976d2', // Material Design의 기본 파란색 계열
    },
    secondary: {
      main: '#dc004e', // Material Design의 기본 빨간색 계열
    },
    // mode: 'dark'를 추가하여 다크 모드를 쉽게 지원할 수 있습니다.
  },
  // 기본 폰트를 설정합니다. (Roboto는 index.html에서 로드될 예정입니다.)
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  // 전역 컴포넌트 기본값 설정 (필요에 따라 주석을 풀고 사용)
  // components: {
  //   MuiButton: {
  //     defaultProps: {
  //       disableElevation: true, // 버튼 그림자 비활성화
  //     },
  //   },
  // },
});

export default theme;