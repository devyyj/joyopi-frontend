// slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accessToken: null,
  user: null, // 사용자 정보 추가
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload; // 사용자 정보 설정
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null; // 로그아웃 시 사용자 정보 초기화
    },
  },
});

export const { setAccessToken, setUser, logout } = authSlice.actions;

export default authSlice.reducer;
