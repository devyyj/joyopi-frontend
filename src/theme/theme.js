// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: [
      '"Pretendard"',
      '-apple-system',
      'BlinkMacSystemFont',
      'system-ui',
      'Roboto',
      'sans-serif',
    ].join(','),
    button: {
      fontWeight: 700, // 버튼 텍스트 강조 (가독성/UX)
    },
  },
  palette: {
    mode: 'light',

    primary: {
      main: '#D2F802', // 애시드 라임 (핵심 액션/강조 색상)
      light: '#E6FF50', // 살짝 밝게
      dark: '#A6C700', // 살짝 어둡게 (호버 시 사용 가능)
      contrastText: '#111111', // 대비되는 텍스트 색상 (검은색)
    },
    secondary: {
      main: '#111111', // 블랙 (주요 텍스트, 아이콘 등)
      contrastText: '#FFFFFF', // 흰색
    },
    // [강화] 깔끔한 모노크롬 디자인 유지를 위한 배경색 정의
    background: {
      default: '#FFFFFF', // 앱의 주 배경색
      paper: '#F7F7F7', // 카드/모달 등 컴포넌트 배경을 약간 톤 다운하여 대비 효과 (선택 사항: 원하시면 #FFFFFF 유지)
    },
    // [강화] 텍스트 가독성 최적화
    text: {
      primary: '#111111', // 가장 중요한 텍스트
      secondary: '#4B5563', // 보조 텍스트 (기존보다 조금 더 진하게 하여 가독성 향상)
    },
    // [추가] 회색 톤을 추가하여 UI 요소에 조화롭게 사용
    grey: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB', // 구분선, 비활성화된 요소 등에 활용
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px', // 깔끔함과 엣지 사이의 적정선
          boxShadow: 'none', // 플랫하고 모던한 느낌을 위한 그림자 제거
          textTransform: 'none', // 대문자 변환 방지 (가독성 향상)
          '&:hover': {
            boxShadow: 'none',
          },
        },
        // [강화] Primary 버튼에 애시드 라임 스타일 명시적 적용
        containedPrimary: {
          color: '#111111', // 버튼의 텍스트 색상 (애시드 라임에 잘 보임)
          backgroundColor: '#D2F802',
          '&:hover': {
            backgroundColor: '#A6C700', // primary.dark 사용
          },
          '&:active': {
            backgroundColor: '#8C9E00', // 더욱 눌린 듯한 효과
          },
        },
        // [추가] Outlined 버튼에 primary 색상 사용으로 일관성 유지
        outlinedPrimary: {
          color: '#111111',
          borderColor: '#D2F802',
          '&:hover': {
            backgroundColor: 'rgba(210, 248, 2, 0.08)', // 애시드 라임 투명도 적용
            borderColor: '#A6C700',
          },
        },
      },
    },
    // Paper(카드) 컴포넌트의 기본 그림자 제거로 깔끔함 강화
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
    // [추가] 아이콘 색상 기본값을 primary 텍스트 색상으로 설정
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: '#111111',
        },
      },
    },
  },
});

export default theme;