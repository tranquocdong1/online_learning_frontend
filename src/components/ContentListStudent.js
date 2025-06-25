import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Divider,
  Button,
  Rating,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const ContentListStudent = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
  const [lessonsByChapter, setLessonsByChapter] = useState({});
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [progress, setProgress] = useState({});
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    fetchChapters();
    fetchProgress();
    fetchRatings();
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
    if (lessonsByChapter[chapterId]) return;
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

  const fetchProgress = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const response = await api.get(`/api/users/${userId}/progress`);
        const progressData = {};
        response.data.data.forEach((p) => {
          progressData[p.lesson_id] = p.status;
        });
        setProgress(progressData);
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  };

  const fetchRatings = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const lessons = Object.values(lessonsByChapter).flat();
        const ratingPromises = lessons.map((lesson) =>
          api.get(`/api/lessons/${lesson.id}/ratings`).then((res) => ({
            lessonId: lesson.id,
            averageRating: res.data.averageRating,
          }))
        );
        const ratingsData = await Promise.all(ratingPromises);
        const ratingsObj = {};
        ratingsData.forEach((r) => (ratingsObj[r.lessonId] = r.averageRating));
        setRatings(ratingsObj);
      }
    } catch (error) {
      console.error("Error loading ratings:", error);
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

  const handleUpdateProgress = async (lessonId, currentStatus) => {
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        let newStatus;
        if (currentStatus === 'not_started') newStatus = 'in_progress';
        else if (currentStatus === 'in_progress') newStatus = 'completed';
        else newStatus = 'not_started';

        await api.put(`/api/users/${userId}/lessons/${lessonId}/progress`, {
          status: newStatus,
        });
        setProgress((prev) => ({
          ...prev,
          [lessonId]: newStatus,
        }));
        fetchProgress();
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const handleRateLesson = async (lessonId, newRating) => {
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        await api.put(`/api/lessons/${lessonId}/ratings`, { rating: newRating });
        fetchRatings(); // Cập nhật lại trung bình sao
      }
    } catch (error) {
      console.error("Error rating lesson:", error);
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
                    sx={{
                      background:
                        progress[lesson.id] === 'completed' ? "#e0f7fa" :
                        progress[lesson.id] === 'in_progress' ? "#fff3e0" : "inherit",
                    }}
                  >
                    <ListItemText
                      primary={`Bài ${lesson.order_number}: ${lesson.title}`}
                    />
                    <Button
                      variant="contained"
                      color={
                        progress[lesson.id] === 'completed' ? "secondary" :
                        progress[lesson.id] === 'in_progress' ? "warning" : "primary"
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateProgress(lesson.id, progress[lesson.id] || 'not_started');
                      }}
                      size="small"
                    >
                      {progress[lesson.id] === 'completed' ? 'Hoàn thành' :
                       progress[lesson.id] === 'in_progress' ? 'Đang học' : 'Bắt đầu'}
                    </Button>
                    <Rating
                      name={`rating-${lesson.id}`}
                      value={ratings[lesson.id] || 0}
                      precision={0.5}
                      onChange={(event, newValue) => {
                        if (newValue) handleRateLesson(lesson.id, newValue);
                      }}
                      readOnly={!progress[lesson.id] === 'completed'} // Chỉ cho phép đánh giá khi hoàn thành
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