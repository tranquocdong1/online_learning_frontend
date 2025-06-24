// components/ContentListStudent.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Divider,
} from "@mui/material";
import { useParams } from "react-router-dom";
import api from "../services/api";

const ContentListStudent = () => {
  const { courseId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [lessonsByChapter, setLessonsByChapter] = useState({});
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    fetchChapters();
  }, [courseId]);

  const fetchChapters = async () => {
    try {
      const response = await api.get(`/api/courses/${courseId}/chapters`);
      setChapters(response.data.data);
    } catch (error) {
      console.error("Error loading chapters:", error);
    }
  };

  const fetchLessons = async (chapterId) => {
    if (lessonsByChapter[chapterId]) return; // tránh load lại
    try {
      const response = await api.get(`/api/chapters/${chapterId}/lessons`);
      setLessonsByChapter((prev) => ({
        ...prev,
        [chapterId]: response.data.data,
      }));
    } catch (error) {
      console.error("Error loading lessons:", error);
    }
  };
  

  const handleChapterClick = (chapterId) => {
    fetchLessons(chapterId);
  };

  const handleLessonClick = async (lessonId) => {
    try {
      const res = await api.get(`/api/lessons/${lessonId}`);
      setSelectedLesson(res.data);
    } catch (error) {
      console.error("Error loading lesson:", error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Nội dung khóa học
      </Typography>

      <List>
        {chapters.map((chapter) => (
          <Box key={chapter.id}>
            <ListItem
              button
              onClick={() => handleChapterClick(chapter.id)}
              sx={{ background: "#f5f5f5", mb: 1 }}
            >
              <ListItemText primary={`Chương ${chapter.order_number}: ${chapter.title}`} />
            </ListItem>
            <Collapse in={!!lessonsByChapter[chapter.id]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 3 }}>
                {lessonsByChapter[chapter.id]?.map((lesson) => (
                  <ListItem
                    key={lesson.id}
                    button
                    onClick={() => handleLessonClick(lesson.id)}
                  >
                    <ListItemText
                      primary={`Bài ${lesson.order_number}: ${lesson.title}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </Box>
        ))}
      </List>

      {selectedLesson && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">{selectedLesson.title}</Typography>
          {selectedLesson.video_url ? (
            <video
              src={selectedLesson.video_url}
              controls
              style={{ width: "100%", marginTop: "10px" }}
            />
          ) : (
            <Typography color="text.secondary">Không có video</Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ContentListStudent;
