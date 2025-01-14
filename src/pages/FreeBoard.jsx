// FreeBoard.jsx
import React, {useState, useRef, useEffect} from "react";
import {useSelector} from "react-redux";
import axios from "../api/axios";
import PostInput from "../components/PostInput";
import Board from "../components/Board";

const FreeBoard = () => {
  const [posts, setPosts] = useState([]); // 게시글 상태 관리
  const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터 여부
  const [page, setPage] = useState(0); // 현재 페이지
  const accessToken = useSelector((state) => state.auth.accessToken);
  const isFetching = useRef(false); // API 호출 중 여부 추적

  // 게시글 데이터 가져오는 함수
  const fetchPosts = async (reset = false) => {
    try {
      if (isFetching.current) return; // 이미 호출 중이면 중단
      isFetching.current = true;

      const response = await axios.get("/freeboard/posts/infinite", {
        params: {
          page: reset ? 0 : page, // 초기화 여부에 따라 페이지 설정
          size: 10,
        },
      });

      const newPosts = response.data;
      setPosts((prevPosts) => (reset ? newPosts : [...prevPosts, ...newPosts]));
      setHasMore(newPosts.length > 0); // 더 불러올 데이터가 있는지 여부 설정
      setPage((prevPage) => (reset ? 1 : prevPage + 1)); // 초기화 시 페이지를 1로 설정

      isFetching.current = false;
    } catch (error) {
      console.error("Error fetching posts:", error);
      isFetching.current = false;
    }
  };

  // 게시글 등록 함수
  const handlePostSubmit = async (post) => {
    try {
      console.log("새 게시글:", post);
      await axios.post("/freeboard/posts", post); // 게시글 서버 전송
      fetchPosts(true); // 데이터 초기화 및 갱신
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  const handleEditPost = (post) => {
    console.log("Editing post:", post);
    // 수정 로직 처리
  };

  const handleDeletePost = async (postId) => {
    await axios.delete("/freeboard/posts/" + postId);
    fetchPosts(true); // 데이터 초기화 및 갱신
  };

  // 초기 데이터 로딩
  useEffect(() => {
    fetchPosts(true); // 처음에 데이터를 불러오도록 설정
  }, []);

  return (
    <>
      {accessToken ? <PostInput onSubmit={handlePostSubmit}/> : null}
      <Board
        posts={posts}
        fetchMorePosts={fetchPosts}
        hasMore={hasMore}
        onEditPost={handleEditPost}
        onDeletePost={handleDeletePost}/>
    </>
  );
};

export default FreeBoard;
