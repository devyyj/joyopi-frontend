import React, { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import axios from "../api/axios.js";
import {useDispatch, useSelector} from "react-redux";
import { setAccessToken } from "../slices/authSlice.js";
import { useNavigate } from "react-router-dom";

const MyInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // 닉네임 편집 모드 상태
  const user = useSelector((state) => state.auth.user); // Redux에서 사용자 정보 가져오기
  const [nickName, setNickName] = useState(user.nickName); // 현재 닉네임 상태

  console.log(user)

  // 닉네임 변경 API 호출
  const handleNicknameChange = async () => {
    try {
      console.log(nickName);
      const response = await axios.patch("/users/me", { nickName: nickName });
      alert("닉네임이 성공적으로 변경되었습니다.");
      setIsEditing(false); // 편집 모드 종료
    } catch (error) {
      console.error(error);
      alert("닉네임 변경에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleConfirmDeletion = async () => {
    try {
      await axios.delete("/users/me");
      await axios.delete('/auth/refresh-token');
      dispatch(setAccessToken(null));
      alert("회원 탈퇴가 완료되었습니다.");
      setIsDialogOpen(false);
      navigate('/');
    } catch (error) {
      console.error(error);
      alert("회원 탈퇴 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Box textAlign="center" mt={5}>
      <Typography variant="h3" gutterBottom>
        내 정보
      </Typography>

      {/* 현재 닉네임 표시 */}
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h6">현재 닉네임: {user.nickName}</Typography>
      </Box>

      {/* 닉네임 수정 모달 */}
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, marginTop: 2 }}>
        <Button
          variant="outlined"
          color={isEditing ? "success" : "primary"}
          onClick={() => setIsEditing(true)}
          sx={{ width: "200px", textTransform: "none" }}
        >
          {isEditing ? "닉네임 수정중" : "닉네임 수정"}
        </Button>
      </Box>

      <Dialog open={isEditing} onClose={() => setIsEditing(false)}>
        <DialogTitle>닉네임 수정</DialogTitle>
        <DialogContent>
          <TextField
            label="닉네임"
            variant="outlined"
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
            sx={{ width: "100%", marginTop: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={() => setIsEditing(false)}>
            취소
          </Button>
          <Button variant="contained" color="primary" onClick={handleNicknameChange}>
            저장
          </Button>
        </DialogActions>
      </Dialog>

      {/* 회원 탈퇴 */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, marginTop: 2 }}>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setIsDialogOpen(true)}
          sx={{ width: "140px" }}
        >
          회원 탈퇴
        </Button>
      </Box>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>회원 탈퇴</DialogTitle>
        <DialogContent>정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.</DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setIsDialogOpen(false)} color="primary">
            취소
          </Button>
          <Button variant="contained" onClick={handleConfirmDeletion} color="error">
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyInfo;
