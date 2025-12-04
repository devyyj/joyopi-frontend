// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    // Pretendard: 힙한 테마일수록 폰트가 깔끔해야 합니다.
    fontFamily: [
      '"Pretendard"',
      '-apple-system',
      'BlinkMacSystemFont',
      'system-ui',
      'Roboto',
      'sans-serif',
    ].join(','),
    button: {
      fontWeight: 700, // 버튼 텍스트를 두껍게 하여 임팩트를 줍니다.
    },
  },
  palette: {
    // 라이트/다크 모드에 따른 자동 색상 전환
    mode: 'light', // 기본값 (상태 관리에 따라 dark로 변경 가능)

    primary: {
      main: '#D2F802', // [핵심] 쨍한 애시드 라임 (형광 연두)
      light: '#E6FF50', // 호버 시 더 밝게
      dark: '#A6C700',  // 클릭 시 약간 어둡게
      contrastText: '#111111', // 형광 배경 위에는 무조건 '검정' 글씨여야 가독성이 나옵니다.
    },
    secondary: {
      main: '#111111', // 보조 버튼은 블랙(라이트모드 기준)으로 시크하게 처리
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF', // 모노크롬 테마는 배경을 깔끔하게 흰색/검정으로 둡니다.
      paper: '#FFFFFF',   // [변경] 카드/메뉴 배경을 순수한 흰색으로 설정하여 촌스러운 느낌을 제거 (원래: #F3F4F6)
    },
    text: {
      primary: '#111111', // 아주 진한 검정 (완전 #000보다는 아주 조금 뺌)
      secondary: '#6B7280', // 회색
    },
  },
  components: {
    // 컴포넌트 스타일 오버라이드 (힙한 느낌 연출)
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0px', // [포인트] 둥근 모서리를 없애거나 아주 적게(4px) 주어 엣지있는 느낌을 줍니다.
          padding: '10px 24px', // 버튼을 크고 시원하게 만듭니다.
          fontSize: '1rem',
          boxShadow: 'none', // 그림자를 없애 플랫(Flat)하고 모던한 느낌을 줍니다.
          border: '1px solid transparent', // 테두리 공간 확보
          '&:hover': {
            boxShadow: 'none', // 호버 시에도 그림자 제거
            backgroundColor: 'transparent', // [변경] 호버 시 배경색 변화를 투명하게 막아 촌스러운 효과를 제거
          },
        },
        // 'outlined' 버튼 스타일 커스텀
        outlined: {
          borderColor: '#111111',
          color: '#111111',
          '&:hover': {
            backgroundColor: '#111111',
            color: '#D2F802', // 블랙 배경 + 형광 텍스트 반전 효과
            borderColor: '#111111',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF', // 앱바를 흰색으로
          color: '#111111', // 텍스트는 검정으로 (미니멀리즘)
          boxShadow: 'none', // 그림자 제거
          borderBottom: '1px solid #E5E7EB', // 하단에 얇은 선만 추가
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // 다크모드 시 MUI 기본 그라데이션 제거
        },
      },
    },
  },
});

export default theme;