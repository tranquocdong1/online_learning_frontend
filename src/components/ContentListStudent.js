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
  TextField,
  ListItemSecondaryAction,
  IconButton,
  Rating,
  ListItemAvatar,
  Avatar,
  Card,
  CardContent,
  Chip,
  Paper,
  Container,
  Grid,
  Badge,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import PendingIcon from "@mui/icons-material/Pending";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import CommentIcon from "@mui/icons-material/Comment";
import StarIcon from "@mui/icons-material/Star";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const ContentListStudent = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
  const [lessonsByChapter, setLessonsByChapter] = useState({});
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [progress, setProgress] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [ratings, setRatings] = useState({});
  const [ratingsList, setRatingsList] = useState({});
  const [expandedChapters, setExpandedChapters] = useState({});

  useEffect(() => {
    fetchChapters();
    fetchProgress();
    if (selectedLesson) {
      fetchComments(selectedLesson.id);
      fetchRatingsLists(selectedLesson.id);
    }
    fetchRatings();
  }, [courseId, selectedLesson]);

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
      const userId = localStorage.getItem("userId");
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

  const fetchComments = async (lessonId) => {
    try {
      const response = await api.get(`/api/lessons/${lessonId}/comments`);
      setComments(response.data.data || []); // Đảm bảo không lỗi nếu không có data
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  const fetchRatings = async () => {
    try {
      const userId = localStorage.getItem("userId");
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

  const fetchRatingsLists = async (lessonId) => {
    try {
      const response = await api.get(`/api/lessons/${lessonId}/ratings/list`);
      setRatingsList((prev) => ({
        ...prev,
        [lessonId]: response.data.ratings,
      }));
    } catch (error) {
      console.error("Error loading ratings list:", error);
    }
  };

  const handleChapterClick = (chapterId) => {
    fetchLessons(chapterId);
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  const handleLessonClick = async (lessonId) => {
    try {
      const res = await api.get(`/api/lessons/${lessonId}`);
      setSelectedLesson(res.data);
      fetchComments(lessonId);
      fetchRatingsLists(lessonId);
    } catch (error) {
      console.error("Error loading lesson:", error);
    }
  };

  const handleUpdateProgress = async (lessonId, currentStatus) => {
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        let newStatus;
        if (currentStatus === "not_started") newStatus = "in_progress";
        else if (currentStatus === "in_progress") newStatus = "completed";
        else newStatus = "not_started";

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

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const userId = localStorage.getItem("userId");
      if (userId && selectedLesson) {
        await api.post(`/api/lessons/${selectedLesson.id}/comments`, {
          content: newComment,
        });
        setNewComment("");
        fetchComments(selectedLesson.id);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const handleUpdateComment = async (e) => {
    e.preventDefault();
    if (!editContent.trim()) return;
    try {
      const userId = localStorage.getItem("userId");
      if (userId && selectedLesson) {
        await api.put(
          `/api/lessons/${selectedLesson.id}/comments/${editingComment}`,
          { content: editContent }
        );
        setEditingComment(null);
        setEditContent("");
        fetchComments(selectedLesson.id);
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const userId = localStorage.getItem("userId");
      if (userId && selectedLesson) {
        await api.delete(
          `/api/lessons/${selectedLesson.id}/comments/${commentId}`
        );
        fetchComments(selectedLesson.id);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleRateLesson = async (lessonId, newRating) => {
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        await api.put(`/api/lessons/${lessonId}/ratings`, { rating: newRating });
        fetchRatings(); // Cập nhật lại trung bình sao
        fetchRatingsLists(lessonId); // Cập nhật danh sách đánh giá
      }
    } catch (error) {
      console.error("Error rating lesson:", error);
    }
  };

  const getProgressIcon = (status) => {
    switch(status) {
      case "completed":
        return <CheckCircleIcon sx={{ color: '#4caf50' }} />;
      case "in_progress":
        return <PendingIcon sx={{ color: '#ff9800' }} />;
      default:
        return <RadioButtonUncheckedIcon sx={{ color: '#9e9e9e' }} />;
    }
  };

  const getProgressColor = (status) => {
    switch(status) {
      case "completed":
        return { 
          bg: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
          border: '#4caf50'
        };
      case "in_progress":
        return { 
          bg: 'linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)',
          border: '#ff9800'
        };
      default:
        return { 
          bg: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
          border: '#e0e0e0'
        };
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 3,
        p: 4,
        mb: 4,
        color: 'white'
      }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          📚 Nội dung khóa học
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Khám phá và học tập theo tiến độ của bạn
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Left Panel - Course Content */}
        <Grid item xs={12} lg={selectedLesson ? 8 : 12}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <CardContent sx={{ p: 0 }}>
              <List sx={{ p: 0 }}>
                {chapters.map((chapter, index) => (
                  <Box key={chapter.id}>
                    <ListItem
                      button
                      onClick={() => handleChapterClick(chapter.id)}
                      sx={{ 
                        background: 'linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)',
                        borderBottom: '1px solid #e0e7ff',
                        py: 2.5,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                          transform: 'translateX(4px)',
                          transition: 'all 0.3s ease'
                        }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          fontWeight: 'bold'
                        }}>
                          {chapter.order_number}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e' }}>
                            {chapter.title}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" sx={{ color: '#5c6bc0', mt: 0.5 }}>
                            Chương {chapter.order_number}
                          </Typography>
                        }
                      />
                      <IconButton>
                        {expandedChapters[chapter.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </ListItem>
                    
                    <Collapse in={expandedChapters[chapter.id]} timeout="auto" unmountOnExit>
                      <Box sx={{ background: '#fafafa' }}>
                        {lessonsByChapter[chapter.id]?.map((lesson, lessonIndex) => {
                          const progressColors = getProgressColor(progress[lesson.id]);
                          return (
                            <ListItem
                              key={lesson.id}
                              button
                              onClick={() => handleLessonClick(lesson.id)}
                              sx={{
                                background: progressColors.bg,
                                borderLeft: `4px solid ${progressColors.border}`,
                                borderBottom: '1px solid rgba(0,0,0,0.05)',
                                mx: 2,
                                my: 1,
                                borderRadius: 2,
                                '&:hover': {
                                  transform: 'translateX(8px)',
                                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                  transition: 'all 0.3s ease'
                                }
                              }}
                            >
                              <ListItemAvatar>
                                {getProgressIcon(progress[lesson.id])}
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                    Bài {lesson.order_number}: {lesson.title}
                                  </Typography>
                                }
                                secondary={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                    <Rating
                                      name={`rating-${lesson.id}`}
                                      value={ratings[lesson.id] || 0}
                                      precision={0.5}
                                      onChange={(event, newValue) => {
                                        if (newValue) handleRateLesson(lesson.id, newValue);
                                      }}
                                      readOnly={!progress[lesson.id] === "completed"}
                                      size="small"
                                    />
                                    <Typography variant="caption" sx={{ color: '#666' }}>
                                      ({ratings[lesson.id]?.toFixed(1) || '0.0'})
                                    </Typography>
                                  </Box>
                                }
                              />
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end', mr: 2 }}>
                                <Button
                                  variant="contained"
                                  size="small"
                                  startIcon={getProgressIcon(progress[lesson.id])}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateProgress(lesson.id, progress[lesson.id] || "not_started");
                                  }}
                                  sx={{
                                    background: progressColors.border,
                                    color: 'white',
                                    fontWeight: 'bold',
                                    borderRadius: 2,
                                    px: 2,
                                    '&:hover': {
                                      background: progressColors.border,
                                      opacity: 0.9
                                    }
                                  }}
                                >
                                  {progress[lesson.id] === "completed"
                                    ? "Hoàn thành"
                                    : progress[lesson.id] === "in_progress"
                                    ? "Đang học"
                                    : "Bắt đầu"}
                                </Button>
                              </Box>
                            </ListItem>
                          );
                        })}
                      </Box>
                    </Collapse>
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Panel - Lesson Details */}
        {selectedLesson && (
          <Grid item xs={12} lg={4}>
            <Card sx={{ 
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              position: 'sticky',
              top: 20
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar sx={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    width: 48,
                    height: 48
                  }}>
                    <VideoLibraryIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                    {selectedLesson.title}
                  </Typography>
                </Box>

                {/* Video Section */}
                <Box sx={{ mb: 4 }}>
                  {selectedLesson.video_url ? (
                    <Box sx={{ 
                      borderRadius: 2,
                      overflow: 'hidden',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }}>
                      <video
                        src={selectedLesson.video_url}
                        controls
                        style={{ width: "100%", display: 'block' }}
                      />
                    </Box>
                  ) : (
                    <Paper sx={{ 
                      p: 4, 
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                      borderRadius: 2
                    }}>
                      <VideoLibraryIcon sx={{ fontSize: 48, color: '#9e9e9e', mb: 2 }} />
                      <Typography color="text.secondary">
                        Không có video
                      </Typography>
                    </Paper>
                  )}
                </Box>

                {/* Ratings Section */}
                <Paper sx={{ p: 3, mb: 3, borderRadius: 2, background: '#fafafa' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <StarIcon sx={{ color: '#ff9800' }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Đánh giá từ người dùng
                    </Typography>
                  </Box>
                  {ratingsList[selectedLesson.id] && ratingsList[selectedLesson.id].length > 0 ? (
                    <List sx={{ maxHeight: 200, overflow: 'auto' }}>
                      {ratingsList[selectedLesson.id].map((rating) => (
                        <ListItem key={rating.id} sx={{ px: 0, py: 1 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                              {rating.User?.username?.charAt(0) || "?"}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="subtitle2">
                                  {rating.User?.username || "Ẩn danh"}
                                </Typography>
                                <Chip 
                                  label={`${rating.rating} ⭐`} 
                                  size="small"
                                  sx={{ backgroundColor: '#fff3e0', color: '#f57c00' }}
                                />
                              </Box>
                            }
                            secondary={
                              <Typography variant="caption" color="text.secondary">
                                {new Date(rating.created_at).toLocaleDateString()}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                      Chưa có đánh giá nào.
                    </Typography>
                  )}
                </Paper>

                {/* Comments Section */}
                <Paper sx={{ p: 3, borderRadius: 2, background: '#fafafa' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <CommentIcon sx={{ color: '#2196f3' }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Bình luận
                    </Typography>
                    <Badge badgeContent={comments.length} color="secondary" />
                  </Box>
                  
                  <Box component="form" onSubmit={handleAddComment} sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Chia sẻ suy nghĩ của bạn về bài học này..."
                      variant="outlined"
                      sx={{ 
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />
                    <Button 
                      type="submit" 
                      variant="contained" 
                      fullWidth
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: 2,
                        py: 1.5
                      }}
                    >
                      Gửi bình luận
                    </Button>
                  </Box>

                  <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {comments.map((comment) => (
                      <ListItem key={comment.id} sx={{ px: 0, alignItems: 'flex-start' }}>
                        <ListItemAvatar>
                          <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                            {comment.User?.username?.charAt(0) || "A"}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                              {comment.User?.username || "Anonymous"}
                            </Typography>
                          }
                          secondary={
                            editingComment === comment.id ? (
                              <Box component="form" onSubmit={handleUpdateComment} sx={{ mt: 1 }}>
                                <TextField
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  fullWidth
                                  multiline
                                  rows={2}
                                  sx={{ mb: 1 }}
                                  variant="outlined"
                                  size="small"
                                />
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Button
                                    type="submit"
                                    variant="contained"
                                    size="small"
                                    sx={{ minWidth: 60 }}
                                  >
                                    Lưu
                                  </Button>
                                  <Button
                                    onClick={() => setEditingComment(null)}
                                    variant="outlined"
                                    size="small"
                                    sx={{ minWidth: 60 }}
                                  >
                                    Hủy
                                  </Button>
                                </Box>
                              </Box>
                            ) : (
                              <Typography variant="body2" sx={{ mt: 0.5 }}>
                                {comment.content}
                              </Typography>
                            )
                          }
                        />
                        {comment.user_id === parseInt(localStorage.getItem("userId")) && (
                          <ListItemSecondaryAction>
                            <IconButton
                              onClick={() => handleEditComment(comment)}
                              size="small"
                              sx={{ mr: 0.5 }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDeleteComment(comment.id)}
                              size="small"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </ListItemSecondaryAction>
                        )}
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default ContentListStudent;