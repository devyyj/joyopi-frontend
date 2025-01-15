import React, { useState, useRef, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Box, Card, CardContent, CircularProgress, Typography, IconButton, Menu, MenuItem, Button } from "@mui/material";
import { useSelector } from "react-redux"; // Redux에서 상태 가져오기
import dayjs from "dayjs";
import MoreVertIcon from "@mui/icons-material/MoreVert"; // 점 3개 아이콘

const Board = ({ posts, fetchMorePosts, hasMore, onEditPost, onDeletePost }) => {
  const user = useSelector((state) => state.auth.user); // Redux에서 사용자 정보 가져오기
  const [anchorEl, setAnchorEl] = useState(null); // 메뉴 anchor element 관리
  const [selectedPost, setSelectedPost] = useState(null); // 선택된 게시글 ID 관리

  // 본문을 더보기/접기 상태 관리
  const [expandedPost, setExpandedPost] = useState(null);

  // 본문 길이가 3줄을 초과하는지 확인하기 위한 ref
  const contentRef = useRef([]);

  const handleMenuClick = (event, post) => {
    setAnchorEl(event.currentTarget);
    setSelectedPost(post);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditPost = () => {
    if (onEditPost) onEditPost(selectedPost.id);
    handleMenuClose();
  };

  const handleDeletePost = () => {
    if (onDeletePost) onDeletePost(selectedPost.id);
    handleMenuClose();
  };

  // '더보기' 버튼 클릭 시 본문 확장/축소 처리
  const toggleExpandPost = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId); // 본문을 확장하거나 축소
  };

  // 본문이 3줄 이상인 경우 '더보기' 버튼을 표시하도록 체크
  const isContentLongEnough = (postContent, index) => {
    if (contentRef.current[index]) {
      const contentHeight = contentRef.current[index].clientHeight;
      return contentHeight > 60; // 60px 이상이면 3줄을 초과한 것으로 간주
    }
    return false;
  };

  return (
    <div>
      <InfiniteScroll
        dataLength={posts.length} // 현재 로딩된 게시글 수
        next={() => fetchMorePosts(false)} // 추가 게시글 로드
        hasMore={hasMore} // 더 불러올 데이터가 있는지 여부
        loader={<CircularProgress sx={{ display: "block", margin: "20px auto" }} />}
        endMessage={<Typography align="center" mb={3}>- 끝 -</Typography>}
      >
        {posts.map((post, index) => (
          <Card
            key={post.id}
            sx={{
              marginBottom: "20px",
              padding: "10px",
              boxShadow: "none",
              position: "relative", // 오른쪽 상단 아이콘을 위한 relative positioning
            }}
          >
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ marginBottom: "5px" }}>
                작성자: {post.userNickname} (ID: {post.userId})
              </Typography>
              <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                {post.title}
              </Typography>

              {/* 본문이 너무 길면 '더보기' 버튼을 보여주고, 사용자가 클릭하면 본문 확장 */}
              <Typography
                variant="body2"
                sx={{
                  marginBottom: "10px",
                  whiteSpace: "pre-wrap", // 줄바꿈과 공백을 그대로 처리
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: expandedPost === post.id ? "none" : 3, // 3줄로 제한하고, 확장 시 전체 본문 표시
                  WebkitBoxOrient: "vertical",
                }}
                ref={(el) => contentRef.current[index] = el} // 해당 index의 본문 ref를 저장
              >
                {post.content}
              </Typography>

              {/* 본문 길이가 3줄을 넘을 경우에만 '더보기' 버튼 표시 */}
              {isContentLongEnough(post.content, index) && (
                <Button
                  variant="text"
                  sx={{ padding: 0 }}
                  onClick={() => toggleExpandPost(post.id)}
                >
                  {expandedPost === post.id ? "접기" : "더보기"}
                </Button>
              )}

              <Box sx={{ textAlign: "right", marginTop: "10px" }}>
                <Typography variant="caption" color="text.secondary">
                  작성일: {dayjs(post.createdAt).format("YYYY-MM-DD HH:mm")}
                </Typography>
              </Box>

              {/* 사용자가 작성한 게시글에만 점 3개 아이콘을 표시 */}
              {user && post.userId === user.id && (
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                  }}
                  onClick={(event) => handleMenuClick(event, post)}
                >
                  <MoreVertIcon />
                </IconButton>
              )}

              {/* 메뉴 */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl) && selectedPost.id === post.id}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleEditPost}>수정</MenuItem>
                <MenuItem onClick={handleDeletePost}>삭제</MenuItem>
              </Menu>
            </CardContent>
          </Card>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default Board;
