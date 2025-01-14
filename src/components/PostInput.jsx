import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Paper, Typography, Collapse } from "@mui/material";

const PostInput = ({ onSubmit, editingPost, onCancelEdit }) => {
  const [title, setTitle] = useState(editingPost ? editingPost.title : "");
  const [content, setContent] = useState(editingPost ? editingPost.content : "");
  const [expanded, setExpanded] = useState(!!editingPost);

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setContent(editingPost.content);
      setExpanded(true);

      // 수정 모드일 때 화면의 최상단으로 스크롤 이동
      window.scrollTo(0, 0);
    }
  }, [editingPost]);

  const handleClear = () => {
    setTitle("");
    setContent("");
    setExpanded(false);
    if (onCancelEdit) onCancelEdit(); // 수정 취소 시 호출
  };

  const handleSubmit = () => {
    if (title.trim() && content.trim()) {
      onSubmit({ title, content, id: editingPost?.id });
      handleClear();
    } else {
      alert("제목과 내용을 입력하세요.");
    }
  };

  const toggleExpanded = () => {
    setExpanded(true);
  };

  return (
    <Paper elevation={3} style={{ padding: "16px", marginBottom: "24px" }} sx={{ boxShadow: 'none' }}>
      {!expanded && !editingPost && (
        <Box style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" onClick={toggleExpanded}>
            게시글 작성
          </Button>
        </Box>
      )}

      <Collapse in={expanded}>
        <Typography variant="h6" gutterBottom style={{ marginTop: "16px" }}>
          {editingPost ? "게시글 수정" : "게시글 작성"}
        </Typography>
        <Box component="form" noValidate autoComplete="off">
          <TextField
            fullWidth
            label="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            margin="normal"
            multiline
            rows={4}
          />
          <Box style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
            <Button
              variant="outlined"
              onClick={handleClear}
              style={{ marginRight: "8px" }}
            >
              {editingPost ? "취소" : "취소"}
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              {editingPost ? "수정" : "작성"}
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default PostInput;
