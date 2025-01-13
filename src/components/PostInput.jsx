import React, { useState } from "react";
import { Box, TextField, Button, Paper, Typography, Collapse } from "@mui/material";

// eslint-disable-next-line react/prop-types
const PostInput = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [expanded, setExpanded] = useState(false); // 영역 확장 여부 상태

  const handleClear = () => {
    setTitle("");
    setContent("");
    setExpanded(false); // 작성 필드 접기
  };

  const handleSubmit = () => {
    if (title.trim() && content.trim()) {
      onSubmit({ title, content });
      handleClear();
    } else {
      alert("제목과 내용을 입력하세요.");
    }
  };

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <Paper elevation={3} style={{ padding: "16px", marginBottom: "24px" }}  sx={{ boxShadow: 'none' }}>
      {/* 작성 버튼 */}
      {!expanded && (
        <Box style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" onClick={toggleExpanded}>
            게시글 작성
          </Button>
        </Box>
      )}

      {/* 작성 폼 */}
      <Collapse in={expanded} >
        <Typography variant="h6" gutterBottom style={{ marginTop: "16px" }}>
          게시글 작성
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
              취소
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              작성 완료
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default PostInput;
