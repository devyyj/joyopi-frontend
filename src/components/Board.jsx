import React, { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Card, CardContent, CircularProgress, Typography, Box, Button } from '@mui/material';
import axios from "../api/axios.js";
import dayjs from 'dayjs';

const Board = () => {
  const [posts, setPosts] = useState([]); // 게시글 상태
  const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지 여부
  const [page, setPage] = useState(0); // 현재 페이지 (0부터 시작)
  const isFetching = useRef(false); // API 호출 상태를 추적하는 ref
  const MAX_CONTENT_LENGTH = 100; // 출력할 최대 글자 수

  const fetchPosts = async () => {
    try {
      if (isFetching.current) return; // 이미 호출 중이면 중단
      isFetching.current = true;

      const response = await axios.get('/freeboard/posts/infinite', {
        params: {
          page: page,
          size: 10, // 페이지 당 불러올 데이터 개수
        },
      });
      const newPosts = response.data;

      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setHasMore(newPosts.length > 0); // 데이터가 더 있으면 true
      setPage((prevPage) => prevPage + 1); // 페이지 증가

      isFetching.current = false;
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []); // 빈 배열을 전달하여 마운트 시 한 번만 실행

  const toggleContent = (id) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id ? { ...post, expanded: !post.expanded } : post
      )
    );
  };

  return (
    <div>
      <InfiniteScroll
        dataLength={posts.length} // 현재 로딩된 게시글 수
        next={fetchPosts} // 스크롤 시 데이터 로드
        hasMore={hasMore} // 더 불러올 데이터가 있는지 여부
        loader={<CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}
        endMessage={<Typography variant="body1" align="center">모든 게시글을 다 봤습니다.</Typography>}
      >
        {posts.map((post) => {
          const isExpanded = post.expanded || false;
          const contentToShow = isExpanded
            ? post.content
            : `${post.content.substring(0, MAX_CONTENT_LENGTH)}${post.content.length > MAX_CONTENT_LENGTH ? '...' : ''}`;

          return (
            <Card
              key={post.id}
              sx={{
                marginBottom: '20px',
                boxShadow: 'none',
                padding: '10px',
                overflow: 'hidden', // 내용 초과 시 잘림
              }}
            >
              <CardContent>
                {/* 작성자 */}
                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '5px' }}>
                  작성자: {post.userNickname} (ID: {post.userId})
                </Typography>

                {/* 제목 */}
                <Typography variant="h6" sx={{ marginBottom: '10px' }}>{post.title}</Typography>

                {/* 내용 */}
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{
                    marginBottom: '10px',
                    overflow: 'hidden',
                  }}
                >
                  {contentToShow}
                </Typography>

                {/* 더보기 버튼 */}
                {post.content.length > MAX_CONTENT_LENGTH && (
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => toggleContent(post.id)}
                    sx={{ padding: 0, minHeight: 0, minWidth: 0, fontSize: '0.8rem' }}
                  >
                    {isExpanded ? '닫기' : '더보기'}
                  </Button>
                )}

                {/* 작성일과 수정일 */}
                <Box sx={{ textAlign: 'right', marginTop: '10px' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', marginBottom: '3px' }}>
                    작성일: {dayjs(post.createdAt).format('YYYY-MM-DD HH:mm')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    수정일: {dayjs(post.updatedAt).format('YYYY-MM-DD HH:mm')}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </InfiniteScroll>
    </div>
  );
};

export default Board;
