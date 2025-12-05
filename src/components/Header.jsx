// src/components/Header.jsx

import React, {useState} from 'react';
import {AppBar, Box, Button, Menu, MenuItem, Toolbar, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';

/**
 * @title 웹 서비스 상단 헤더 컴포넌트
 * @description 로고 글씨 크기를 키우고, 연구소 메뉴를 드롭다운으로 구현하며, 디자인을 단조롭게 변경합니다.
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
    // 배경: 흰색, 텍스트: 검은색 유지
    <AppBar position="static"
            sx={(theme) => ({
              backgroundColor: theme.palette.background.default, // 흰색 배경
              color: theme.palette.text.primary, // 검은색 텍스트
              // 얇은 하단 경계선 유지
              boxShadow: '0 1px 0 0 rgba(0, 0, 0, 0.05)',
            })}
    >
      <Toolbar>
        {/* 1. 로고/서비스명 */}
        {/*
          [수정된 부분]
          로고 텍스트 "Yopisode"를 <Typography> 내부에서 처리하며,
          'Yopi' 부분만 강조하기 위해 <span> 태그를 사용하여 스타일을 지정합니다.
          강조 스타일: 'Yopi'에 메인 색상(primary)을 적용하고 굵게 표시합니다.
        */}
        <Typography
          variant="h4"
          component="div"
          onClick={handleLogoClick}
          sx={{
            cursor: 'pointer',
            // color 설정을 제거하여 AppBar에 설정된 검은색 텍스트 색상을 상속받습니다.
          }}
        >
          {/* 'Yopi' 강조 */}
          <span style={{color: '#8BC34A', fontWeight: 'bold'}}>Yopi</span>
          {/* 'sode'는 기존 텍스트 색상을 상속받음 */}
          sode
        </Typography>

        {/* 2. '연구소' 메뉴 (드롭다운 버튼) */}
        <Button
          color="inherit"
          onClick={handleMenuClick}
          sx={{textTransform: 'none', mx: 1}}
        >
          연구 기록
        </Button>

        {/* '연구소' 드롭다운 메뉴 */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
        >
          {/* 하위 메뉴: 닉네임 */}
          <MenuItem
            onClick={() => handleMenuItemClick('/lab/nickname')}
          >
            닉네임 연구
          </MenuItem>
          {/* 하위 메뉴: 로또 번호 */}
          <MenuItem
            onClick={() => handleMenuItemClick('/lab/lotto')}
          >
            로또 번호 연구
          </MenuItem>
          <MenuItem
            onClick={() => handleMenuItemClick('/lab/food')}
          >
            식사 메뉴 연구
          </MenuItem>
        </Menu>

        {/* 3. 빈 공간 */}
        <Box sx={{flexGrow: 1}}/>

      </Toolbar>
    </AppBar>
  );
}

export default Header;