import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, MenuItem } from "@mui/material";
import { toast } from "react-toastify";
import { NoteAdd } from "@mui/icons-material";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import api from "../services/api";

const NotesTab = ({ progressHistory, fetchNotesCallback, isDarkMode }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [lessonId, setLessonId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotesCallback]);

  const fetchNotes = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      console.log("Fetching notes for userId:", userId, "with token:", token);
      const response = await api.get("/api/users/notes"); // Cập nhật URL
      setNotes(response.data.data || []);
    } catch (error) {
      console.error(
        "Error fetching notes:",
        error.response?.data || error.message
      );
      toast.error("Không tải được ghi chú");
    }
  };

  const handleAddNote = async () => {
    if (!lessonId || !newNote.trim()) {
      toast.error("Vui lòng chọn bài học và nhập nội dung ghi chú");
      return;
    }
    try {
      await api.post("/api/notes", { lesson_id: lessonId, content: newNote });
      toast.success("Ghi chú đã được thêm");
      setNewNote("");
      if (fetchNotesCallback) fetchNotesCallback(); // Gọi callback để cập nhật notes
    } catch (error) {
      toast.error("Lỗi khi thêm ghi chú");
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Ghi chú của bạn
      </Typography>
      {/* Form thêm ghi chú */}
      <Box sx={{ mb: 3 }}>
        <TextField
          select
          label="Chọn bài học"
          value={lessonId || ""}
          onChange={(e) => setLessonId(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          InputProps={{
            sx: {
              backgroundColor: isDarkMode ? "grey.800" : "white",
              borderRadius: 2,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: isDarkMode ? "grey.700" : "grey.300",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "primary.main",
              },
            },
          }}
        >
          {progressHistory.map((prog) => (
            <MenuItem key={prog.id} value={prog.lesson_id}>
              {prog.Lesson.title}
            </MenuItem>
          ))}
        </TextField>
        <TextareaAutosize
          minRows={4}
          placeholder="Nhập ghi chú của bạn..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 4,
            border: `1px solid ${isDarkMode ? "#4a5568" : "#e2e8f0"}`,
            backgroundColor: isDarkMode ? "#2d3748" : "#edf2f7",
            color: isDarkMode ? "#e2e8f0" : "#2d3748",
            resize: "vertical",
          }}
        />
        <Button
          variant="contained"
          onClick={handleAddNote}
          startIcon={<NoteAdd />}
          sx={{ mt: 2, py: 1.2 }}
        >
          Thêm ghi chú
        </Button>
      </Box>
      {/* Danh sách ghi chú */}
      {notes.length > 0 ? (
        notes.map((note) => (
          <Box
            key={note.id}
            sx={{
              p: 2,
              mb: 2,
              bgcolor: isDarkMode ? "grey.800" : "grey.100",
              borderRadius: 2,
              border: "1px solid",
              borderColor: isDarkMode ? "grey.700" : "grey.300",
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Bài học: {note.Lesson.title}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {note.content}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Ngày tạo: {new Date(note.created_at).toLocaleDateString()}
            </Typography>
          </Box>
        ))
      ) : (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", mt: 2 }}
        >
          Chưa có ghi chú nào.
        </Typography>
      )}
    </Box>
  );
};

export default NotesTab;
