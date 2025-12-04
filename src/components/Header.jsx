// src/components/Header.jsx

import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

/**
 * @title 웹 서비스 상단 헤더 컴포넌트
 * @description 로고 글씨 크기를 키우고, 연구소 메뉴를 드롭다운으로 구현합니다.
 */
function Header() {
  const navigate = useNavigate();

  // '연구소' 메뉴 관리를 위한 상태
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  /**
   * @description 로고/서비스명 클릭 시 메인 화면으로 이동합니다.
   */
  const handleLogoClick = () => {
    navigate('/');
  };

  /**
   * @description '연구소' 버튼 클릭 시 메뉴를 엽니다.
   * @param {React.MouseEvent<HTMLButtonElement>} event - 버튼 클릭 이벤트 객체
   */
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * @description 메뉴를 닫습니다.
   */
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  /**
   * @description 메뉴 항목 클릭 시 페이지 이동 후 메뉴를 닫습니다.
   * @param {string} path - 이동할 경로
   */
  const handleMenuItemClick = (path) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* 1. 로고/서비스명 */}
        <Typography
          variant="h4"
          component="div"
          onClick={handleLogoClick}
          sx={{
            cursor: 'pointer'
          }}
        >
          요피랜드
        </Typography>

        {/* 2. [변경] '연구소' 메뉴 (드롭다운 버튼) */}
        <Button
          color="inherit"
          onClick={handleMenuClick}
          sx={{ textTransform: 'none' }}
        >
          연구소
        </Button>

        {/* '연구소' 드롭다운 메뉴 */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
        >
          {/* 하위 메뉴: 로또 번호 */}
          <MenuItem
            onClick={() => handleMenuItemClick('/lab/lotto')}
          >
            로또 번호
          </MenuItem>
          {/* 하위 메뉴: 닉네임 */}
          <MenuItem
            onClick={() => handleMenuItemClick('/lab/nickname')}
          >
            닉네임
          </MenuItem>
        </Menu>

        {/* 3. 빈 공간 */}
        <Box sx={{ flexGrow: 1 }} />

      </Toolbar>
    </AppBar>
  );
}

export default Header;