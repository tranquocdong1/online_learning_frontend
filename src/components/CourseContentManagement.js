import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Card,
  CardContent,
  Avatar,
  Divider,
  Fade,
  Tooltip,
  alpha,
  Chip,
  Badge,
} from "@mui/material";
import { 
  ExpandMore, 
  Edit, 
  Delete, 
  Add,
  PlayCircle,
  VideoLibrary,
  MenuBook,
  Article,
  CloudUpload,
  Visibility,
  DragIndicator,
  ArrowBack // Thêm import ArrowBack
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom"; // Thêm import useNavigate
import api from "../services/api";

const CourseContentManagement = () => {
  const { courseId } = useParams();
  const navigate = useNavigate(); // Khởi tạo useNavigate
  const [chapters, setChapters] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    order_number: 1,
    video: null,
  });

  const fetchChapters = async () => {
    try {
      const response = await api.get(`/admin/courses/${courseId}/chapters`);
      const chaptersData = response.data.data;
      const chaptersWithLessons = await Promise.all(
        chaptersData.map(async (chapter) => {
          const lessonsResponse = await api.get(
            `/admin/chapters/${chapter.id}/lessons`
          );
          return { ...chapter, lessons: lessonsResponse.data.data };
        })
      );
      setChapters(chaptersWithLessons);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch content");
    }
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  const handleOpenDialog = (action, item = null, type = "chapter") => {
    setDialogAction(action);
    setSelectedItem({ ...item, type });
    setFormData(
      item
        ? {
            title: item.title,
            order_number: item.order_number || 1,
            video: null,
          }
        : { title: "", order_number: 1, video: null }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
    setDialogAction("");
    setFormData({ title: "", order_number: 1, video: null });
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, video: e.target.files[0] });
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title.trim());
      formDataToSend.append("order_number", formData.order_number);

      if (formData.video) {
        formDataToSend.append("video", formData.video);
      }

      // Debug dữ liệu gửi đi
      for (let pair of formDataToSend.entries()) {
        console.log("FormData sent:", pair[0] + ": " + pair[1]);
      }

      if (selectedItem?.type === "chapter") {
        if (dialogAction === "create") {
          const response = await api.post(
            `/admin/courses/${courseId}/chapters`,
            formDataToSend
          );
          console.log("Response from server:", response.data);
          toast.success("Chapter created successfully");
        } else if (dialogAction === "edit") {
          await api.put(
            `/admin/courses/${courseId}/chapters/${selectedItem.id}`,
            formDataToSend
          );
          toast.success("Chapter updated successfully");
        } else if (dialogAction === "delete") {
          await api.delete(
            `/admin/courses/${courseId}/chapters/${selectedItem.id}`
          );
          toast.success("Chapter deleted successfully");
        }
      } else if (selectedItem?.type === "lesson") {
        if (dialogAction === "create") {
          await api.post(
            `/admin/chapters/${selectedItem.chapterId}/lessons`,
            formDataToSend
          );
          toast.success("Lesson created successfully");
        } else if (dialogAction === "edit") {
          await api.put(
            `/admin/chapters/${selectedItem.chapterId}/lessons/${selectedItem.id}`,
            formDataToSend
          );
          toast.success("Lesson updated successfully");
        } else if (dialogAction === "delete") {
          await api.delete(
            `/admin/chapters/${selectedItem.chapterId}/lessons/${selectedItem.id}`
          );
          toast.success("Lesson deleted successfully");
        }
      }
      fetchChapters();
      handleCloseDialog();
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
      console.error("Error details:", error.response?.data);
    }
  };

  const getDialogConfig = () => {
    switch (dialogAction) {
      case 'create':
        return {
          title: `Create ${selectedItem?.type === "chapter" ? "Chapter" : "Lesson"}`,
          color: 'success',
          gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        };
      case 'edit':
        return {
          title: `Edit ${selectedItem?.type === "chapter" ? "Chapter" : "Lesson"}`,
          color: 'primary',
          gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        };
      case 'delete':
        return {
          title: `Delete ${selectedItem?.type === "chapter" ? "Chapter" : "Lesson"}`,
          color: 'error',
          gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
        };
      default:
        return {
          title: 'Manage Content',
          color: 'primary',
          gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        };
    }
  };

  const getTotalLessons = () => {
    return chapters.reduce((total, chapter) => total + (chapter.lessons?.length || 0), 0);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Card 
        elevation={0} 
        sx={{ 
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 200,
            height: 200,
            background: alpha('#fff', 0.1),
            borderRadius: '50%',
            transform: 'translate(50%, -50%)'
          }}
        />
        <CardContent sx={{ py: 4, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Back">
              <IconButton
                onClick={() => navigate(-1)} // Quay lại trang trước
                sx={{ 
                  color: 'white',
                  '&:hover': {
                    backgroundColor: alpha('#ffffff', 0.2)
                  }
                }}
              >
                <ArrowBack />
              </IconButton>
            </Tooltip>
            <Avatar 
              sx={{ 
                bgcolor: alpha('#fff', 0.2),
                width: 56,
                height: 56 
              }}
            >
              <VideoLibrary sx={{ fontSize: 28 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Course Content Management
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Organize chapters and lessons for your course
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
        <Card 
          elevation={0} 
          sx={{ 
            flex: 1, 
            borderRadius: 3, 
            border: '1px solid', 
            borderColor: 'divider',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="h4" fontWeight="bold">
              {chapters.length}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Total Chapters
            </Typography>
          </CardContent>
        </Card>
        <Card 
          elevation={0} 
          sx={{ 
            flex: 1, 
            borderRadius: 3, 
            border: '1px solid', 
            borderColor: 'divider',
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white'
          }}
        >
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="h4" fontWeight="bold">
              {getTotalLessons()}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Total Lessons
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Main Content Card */}
      <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          {/* Add Chapter Button */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Course Structure
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog("create", null, "chapter")}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
                px: 3,
                '&:hover': {
                  opacity: 0.9,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Add Chapter
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Chapters */}
          {chapters.length === 0 ? (
            <Card 
              elevation={0} 
              sx={{ 
                textAlign: 'center', 
                py: 8, 
                bgcolor: alpha('#667eea', 0.02),
                border: '2px dashed',
                borderColor: alpha('#667eea', 0.2),
                borderRadius: 3
              }}
            >
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  mx: 'auto', 
                  mb: 2,
                  bgcolor: alpha('#667eea', 0.1),
                  color: '#667eea'
                }}
              >
                <MenuBook sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No chapters yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Start building your course by adding the first chapter
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog("create", null, "chapter")}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold'
                }}
              >
                Create First Chapter
              </Button>
            </Card>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {chapters.map((chapter, chapterIndex) => (
                <Fade in={true} timeout={300 + chapterIndex * 100} key={chapter.id}>
                  <Accordion
                    elevation={0}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: '12px !important',
                      '&:before': { display: 'none' },
                      '&.Mui-expanded': {
                        margin: 0,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
                      }
                    }}
                  >
                    <AccordionSummary 
                      expandIcon={<ExpandMore />}
                      sx={{
                        borderRadius: '12px',
                        minHeight: 80,
                        '&.Mui-expanded': {
                          borderBottomLeftRadius: 0,
                          borderBottomRightRadius: 0,
                        },
                        px: 3,
                        bgcolor: alpha('#667eea', 0.02)
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                          <MenuBook />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" fontWeight="bold">
                            {chapter.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                            <Badge badgeContent={chapter.lessons?.length || 0} color="primary">
                              <Chip 
                                icon={<Article />}
                                label="Lessons" 
                                size="small" 
                                variant="outlined"
                              />
                            </Badge>
                            <Chip 
                              icon={<DragIndicator />}
                              label={`Order: ${chapter.order_number || chapterIndex + 1}`}
                              size="small" 
                              color="secondary"
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Edit Chapter">
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDialog("edit", chapter, "chapter");
                              }}
                              color="primary"
                              size="small"
                              sx={{ 
                                borderRadius: 1.5,
                                '&:hover': {
                                  transform: 'scale(1.1)',
                                  bgcolor: alpha('#2196f3', 0.1)
                                },
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Chapter">
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDialog("delete", chapter, "chapter");
                              }}
                              color="error"
                              size="small"
                              sx={{ 
                                borderRadius: 1.5,
                                '&:hover': {
                                  transform: 'scale(1.1)',
                                  bgcolor: alpha('#f44336', 0.1)
                                },
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                      <Box sx={{ p: 3, pt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                          <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">
                            Lessons in this chapter
                          </Typography>
                          <Button
                            variant="outlined"
                            startIcon={<Add />}
                            onClick={() =>
                              handleOpenDialog(
                                "create",
                                { chapterId: chapter.id },
                                "lesson"
                              )
                            }
                            sx={{
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 'medium'
                            }}
                          >
                            Add Lesson
                          </Button>
                        </Box>

                        {chapter.lessons?.length === 0 ? (
                          <Card 
                            elevation={0} 
                            sx={{ 
                              textAlign: 'center', 
                              py: 4, 
                              bgcolor: alpha('#4facfe', 0.02),
                              border: '1px dashed',
                              borderColor: alpha('#4facfe', 0.2),
                              borderRadius: 2
                            }}
                          >
                            <Avatar 
                              sx={{ 
                                width: 48, 
                                height: 48, 
                                mx: 'auto', 
                                mb: 1,
                                bgcolor: alpha('#4facfe', 0.1),
                                color: '#4facfe'
                              }}
                            >
                              <PlayCircle />
                            </Avatar>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              No lessons in this chapter
                            </Typography>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Add />}
                              onClick={() =>
                                handleOpenDialog(
                                  "create",
                                  { chapterId: chapter.id },
                                  "lesson"
                                )
                              }
                              sx={{ mt: 1, borderRadius: 2, textTransform: 'none' }}
                            >
                              Add First Lesson
                            </Button>
                          </Card>
                        ) : (
                          <TableContainer 
                            component={Paper} 
                            elevation={0} 
                            sx={{ 
                              borderRadius: 2, 
                              border: '1px solid', 
                              borderColor: 'divider' 
                            }}
                          >
                            <Table>
                              <TableHead>
                                <TableRow sx={{ bgcolor: alpha('#4facfe', 0.05) }}>
                                  <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                    Lesson
                                  </TableCell>
                                  <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                    Order
                                  </TableCell>
                                  <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                    Video
                                  </TableCell>
                                  <TableCell 
                                    align="center" 
                                    sx={{ fontWeight: 'bold', color: 'text.primary' }}
                                  >
                                    Actions
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {chapter.lessons.map((lesson, lessonIndex) => (
                                  <TableRow 
                                    key={lesson.id}
                                    hover
                                    sx={{ 
                                      '&:hover': { 
                                        bgcolor: alpha('#4facfe', 0.02) 
                                      },
                                      transition: 'all 0.2s ease'
                                    }}
                                  >
                                    <TableCell>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar 
                                          sx={{ 
                                            width: 32, 
                                            height: 32,
                                            bgcolor: 'secondary.main',
                                            fontSize: '0.875rem'
                                          }}
                                        >
                                          {lessonIndex + 1}
                                        </Avatar>
                                        <Typography variant="body2" fontWeight="medium">
                                          {lesson.title}
                                        </Typography>
                                      </Box>
                                    </TableCell>
                                    <TableCell>
                                      <Chip 
                                        label={lesson.order_number || "-"}
                                        size="small"
                                        variant="outlined"
                                        color="primary"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      {lesson.video_url ? (
                                        <Button
                                          size="small"
                                          startIcon={<Visibility />}
                                          href={lesson.video_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          sx={{ 
                                            textTransform: 'none',
                                            borderRadius: 2
                                          }}
                                        >
                                          View Video
                                        </Button>
                                      ) : (
                                        <Typography variant="body2" color="text.secondary">
                                          No video
                                        </Typography>
                                      )}
                                    </TableCell>
                                    <TableCell align="center">
                                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                        <Tooltip title="Edit Lesson">
                                          <IconButton
                                            onClick={() =>
                                              handleOpenDialog(
                                                "edit",
                                                { ...lesson, chapterId: chapter.id },
                                                "lesson"
                                              )
                                            }
                                            color="primary"
                                            size="small"
                                            sx={{ 
                                              borderRadius: 1.5,
                                              '&:hover': {
                                                transform: 'scale(1.1)'
                                              },
                                              transition: 'all 0.2s ease'
                                            }}
                                          >
                                            <Edit fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete Lesson">
                                          <IconButton
                                            onClick={() =>
                                              handleOpenDialog(
                                                "delete",
                                                { ...lesson, chapterId: chapter.id },
                                                "lesson"
                                              )
                                            }
                                            color="error"
                                            size="small"
                                            sx={{ 
                                              borderRadius: 1.5,
                                              '&:hover': {
                                                transform: 'scale(1.1)'
                                              },
                                              transition: 'all 0.2s ease'
                                            }}
                                          >
                                            <Delete fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                      </Box>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        )}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Fade>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 600
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              sx={{ 
                bgcolor: alpha(getDialogConfig().color === 'error' ? '#f44336' : 
                              getDialogConfig().color === 'success' ? '#4caf50' : '#2196f3', 0.1),
                color: getDialogConfig().color === 'error' ? '#f44336' : 
                       getDialogConfig().color === 'success' ? '#4caf50' : '#2196f3',
                width: 40,
                height: 40
              }}
            >
              {dialogAction === 'create' ? <Add /> : 
               dialogAction === 'edit' ? <Edit /> : <Delete />}
            </Avatar>
            <Typography variant="h6" fontWeight="bold">
              {getDialogConfig().title}
            </Typography>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3, pb: 3, minHeight: dialogAction === 'delete' ? 'auto' : 300 }}>
          {dialogAction === "delete" ? (
            <DialogContentText sx={{ fontSize: '1rem' }}>
              Are you sure you want to delete the {selectedItem?.type} "<strong>{selectedItem?.title}</strong>"?
              <Typography component="div" sx={{ mt: 2, color: 'error.main', fontSize: '0.875rem' }}>
                This action cannot be undone and will remove all associated content.
              </Typography>
            </DialogContentText>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                required
                fullWidth
                autoComplete="off"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              <TextField
                label="Order Number"
                name="order_number"
                type="number"
                value={formData.order_number}
                onChange={handleFormChange}
                required
                fullWidth
                autoComplete="off"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              {selectedItem?.type === "lesson" && (
                <Box>
                  <Button 
                    variant="contained" 
                    component="label"
                    startIcon={<CloudUpload />}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    }}
                  >
                    Upload Video
                    <input
                      type="file"
                      hidden
                      accept="video/*"
                      onChange={handleFileChange}
                    />
                  </Button>
                  {formData.video && (
                    <Typography sx={{ mt: 1, color: 'success.main', fontSize: '0.875rem' }}>
                      ✓ Selected: {formData.video.name}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            color={getDialogConfig().color}
            autoFocus
            sx={{ 
              borderRadius: 2,
              background: dialogAction !== 'delete' ? getDialogConfig().gradient : undefined
            }}
          >
            {dialogAction === "delete" ? "Delete" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CourseContentManagement;