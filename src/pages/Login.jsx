import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setAccessToken} from "../slices/authSlice";
import {Button, Box, Typography, CircularProgress, Backdrop} from "@mui/material";
import axios from '../api/axios.js'; // axios 임포트

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false); // 모달 오픈 상태 관리

  // 카카오 로그인 URL (카카오 앱 키와 리다이렉트 URI를 설정해야 함)
  const KAKAO_LOGIN_URL = import.meta.env.VITE_API_URL + "/oauth2/authorization/kakao"; // 서버에서 처리하는 카카오 로그인 URI

  useEffect(() => {
    const handleAuth = async () => {
      // 쿼리 파라미터에서 access_token과 logout 추출
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('access_token');
      const logout = urlParams.get('logout'); // 로그아웃 파라미터 확인

      setOpenModal(true); // 모달 오픈

      // 로그아웃 처리
      if (logout !== null) {
        try {
          // 서버에서 로그아웃 요청 (refreshToken 삭제)
          const response = await axios.delete('/auth/refresh-token', {
            withCredentials: true, // 쿠키를 포함하여 요청
          });

          if (response.status === 200) {
            dispatch(setAccessToken(null)); // Redux에서 액세스 토큰 초기화
            // 로그아웃 성공 시 메인 페이지로 리다이렉트
            navigate('/');
          } else {
            console.error('로그아웃 실패');
          }
        } catch (error) {
          console.error('로그아웃 중 오류 발생', error);
        }
      }

      // 로그인 처리
      if (token) {
        // 액세스 토큰이 있으면 Redux에 저장
        dispatch(setAccessToken(token));

        // 메인 페이지로 리다이렉트
        navigate('/');
      }

      setOpenModal(false); // 모달 닫기
    };

    handleAuth();
  }, [dispatch, navigate]);

  return (
    <>
      {/* 전체 화면을 덮는 Backdrop */}
      <Backdrop
        open={openModal} // 모달이 열리면 true
        sx={{
          color: '#000', // 글씨 색을 검정색으로 설정
          zIndex: (theme) => theme.zIndex.drawer + 1, // 다른 요소들보다 위에 오도록 설정
        }}
      >
        <Box
          sx={{
            backgroundColor: 'white',
            padding: 4,
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={50}/>
          <Typography variant="h6" sx={{mt: 2}}>
            처리 중입니다...
          </Typography>
        </Box>
      </Backdrop>

      {/* 로그인 페이지 UI */}
      <Box textAlign="center" mt={5}>
        <Typography variant="h3" gutterBottom>
          로그인 페이지
        </Typography>
        <Typography variant="body1" gutterBottom>
          카카오톡으로 로그인
        </Typography>
        {/* 카카오 로그인 버튼 */}
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2}}>
          <Button
            variant="contained"
            color="warning"
            size="large"
            href={KAKAO_LOGIN_URL}
            sx={{
              width: 'auto', // 버튼 너비 자동 설정
              backgroundColor: "#FEE500",
              color: "#000000",
              "&:hover": {
                backgroundColor: "#E5D000",
              },
            }}
          >
            카카오로 로그인
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/")}
            sx={{width: 'auto'}} // 버튼 너비 자동 설정
          >
            메인 페이지로 이동
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Login;
