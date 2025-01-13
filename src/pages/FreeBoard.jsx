import Board from "../components/Board.jsx";
import PostInput from "../components/PostInput.jsx";
import {useSelector} from "react-redux";
import axios from "../api/axios.js";

const FreeBoard = () => {

  const accessToken = useSelector((state) => state.auth.accessToken);

  const handlePostSubmit = async (post) => {
    console.log("새 게시글:", post);
    // 여기에 게시글 데이터를 서버로 전송하는 로직 추가
    await axios.post("/freeboard/posts", post)
  };

  return <>
    {accessToken ? <PostInput onSubmit={handlePostSubmit}/> : null}
    <Board/>
  </>
}

export default FreeBoard