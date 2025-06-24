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
} from "@mui/material";
import { ExpandMore, Edit, Delete, Add } from "@mui/icons-material";
import { toast } from "react-toastify";
import api from "../services/api";
import { useParams } from "react-router-dom";

const CourseContentManagement = () => {
  const { courseId } = useParams();
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Course Content Management
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog("create", null, "chapter")}
        >
          Add Chapter
        </Button>
      </Box>
      {chapters.map((chapter) => (
        <Accordion key={chapter.id}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>{chapter.title}</Typography>
            <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDialog("edit", chapter, "chapter");
                }}
              >
                <Edit />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDialog("delete", chapter, "chapter");
                }}
              >
                <Delete />
              </IconButton>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ mb: 2 }}>
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
              >
                Add Lesson
              </Button>
            </Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Order</TableCell>
                    <TableCell>Video</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {chapter.lessons.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell>{lesson.title}</TableCell>
                      <TableCell>{lesson.order}</TableCell>
                      <TableCell>
                        {lesson.video_url ? (
                          <a
                            href={lesson.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Video
                          </a>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() =>
                            handleOpenDialog(
                              "edit",
                              { ...lesson, chapterId: chapter.id },
                              "lesson"
                            )
                          }
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            handleOpenDialog(
                              "delete",
                              { ...lesson, chapterId: chapter.id },
                              "lesson"
                            )
                          }
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogAction === "create"
            ? `Create ${selectedItem?.type === "chapter" ? "Chapter" : "Lesson"}`
            : dialogAction === "edit"
              ? `Edit ${selectedItem?.type === "chapter" ? "Chapter" : "Lesson"}`
              : `Delete ${selectedItem?.type === "chapter" ? "Chapter" : "Lesson"}`}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 3, pl: 3, pr: 3, overflowY: "auto" }}>
          {dialogAction === "delete" ? (
            <DialogContentText>
              Are you sure you want to delete the {selectedItem?.type} "
              {selectedItem?.title}"?
            </DialogContentText>
          ) : (
            <>
              <TextField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                required
                fullWidth
                margin="normal"
                autoComplete="off"
              />
              <TextField
                label="Order"
                name="order_number"
                type="number"
                value={formData.order_number}
                onChange={handleFormChange}
                required
                fullWidth
                margin="normal"
                autoComplete="off"
              />
              {selectedItem?.type === "lesson" && (
                <>
                  <Button variant="contained" component="label" sx={{ mt: 2 }}>
                    Upload Video
                    <input
                      type="file"
                      hidden
                      accept="video/*"
                      onChange={handleFileChange}
                    />
                  </Button>
                  {formData.video && (
                    <Typography sx={{ mt: 1 }}>
                      Selected: {formData.video.name}
                    </Typography>
                  )}
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary" autoFocus>
            {dialogAction === "delete" ? "Delete" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseContentManagement;
