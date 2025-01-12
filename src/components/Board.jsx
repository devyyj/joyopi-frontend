import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import axios from "../api/axios.js";

const Board = () => {
  const [posts, setPosts] = useState([]); // 게시글 상태
  const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지 여부
  const [page, setPage] = useState(0); // 현재 페이지 (0부터 시작)

  // 게시글 로딩 함수 (무한스크롤용)
  const fetchPosts = async () => {
    try {
      // 스프링 부트 API의 무한스크롤 엔드포인트 호출
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
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // 처음 페이지 로드 시 게시글 데이터 가져오기
  useEffect(() => {
    fetchPosts();
  }, []); // 빈 배열을 전달하여 마운트 시 한 번만 실행

  return (
    <div>
      <InfiniteScroll
        dataLength={posts.length} // 현재 로딩된 게시글 수
        next={fetchPosts} // 스크롤 시 데이터 로드
        hasMore={hasMore} // 더 불러올 데이터가 있는지 여부
        loader={<CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}
        endMessage={<Typography variant="body1" align="center">모든 게시글을 다 봤습니다.</Typography>}
      >
        {posts.map((post) => (
          <Card key={post.id} sx={{ marginBottom: '20px' }}>
            <CardContent>
              <Typography variant="h6">{post.title}</Typography>
              <Typography variant="body2" color="text.secondary">{post.body}</Typography>
            </CardContent>
          </Card>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default Board;
