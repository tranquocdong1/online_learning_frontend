import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Pagination,
  Box,
  TextField,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Edit, Delete, Settings } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    status: "active",
    thumbnail: null,
  });
  const limit = 50;
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const response = await api.get("/admin/courses", {
        params: { page: currentPage, limit },
      });
      console.log('API response:', response.data);
      setCourses(response.data.data);
      setTotalPages(response.data.pages);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch courses");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/admin/categories", {
        params: { page: 1, limit: 100 },
      });
      setCategories(response.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, [currentPage]);

  const handleOpenDialog = (action, course = null) => {
    setDialogAction(action);
    setSelectedCourse(course);
    setFormData(
      course
        ? {
            title: course.title,
            description: course.description || "",
            category_id: course.category_id,
            status: course.status,
            thumbnail: null,
          }
        : {
            title: "",
            description: "",
            category_id: "",
            status: "active",
            thumbnail: null,
          }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCourse(null);
    setDialogAction("");
    setFormData({
      title: "",
      description: "",
      category_id: "",
      status: "active",
      thumbnail: null,
    });
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, thumbnail: e.target.files[0] });
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category_id", formData.category_id);
      console.log('FormData status:', formData.status);
      formDataToSend.append("status", formData.status);
      if (formData.thumbnail) {
        formDataToSend.append("thumbnail", formData.thumbnail);
      }

      if (dialogAction === "create") {
        await api.post("/admin/courses", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Course created successfully");
      } else if (dialogAction === "edit") {
        await api.put(`/admin/courses/${selectedCourse.id}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Course updated successfully");
      } else if (dialogAction === "delete") {
        await api.delete(`/admin/courses/${selectedCourse.id}`);
        toast.success("Course deleted successfully");
      }
      fetchCourses();
      handleCloseDialog();
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Course Management
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog("create")}
        >
          Add Course
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Thumbnail</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>Content</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.id}</TableCell>
                <TableCell>{course.title}</TableCell>
                <TableCell>{course.Category?.name || "-"}</TableCell>
                <TableCell>
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      style={{ width: 50, height: 50, objectFit: "cover" }}
                    />
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>{course.status}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleOpenDialog("edit", course)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleOpenDialog("delete", course)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() =>
                      navigate(`/admin/courses/${course.id}/content`)
                    }
                    color="secondary"
                  >
                    <Settings />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogAction === "create"
            ? "Create Course"
            : dialogAction === "edit"
              ? "Edit Course"
              : "Delete Course"}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 3, pl: 3, pr: 3, overflowY: "auto" }}>
          {dialogAction === "delete" ? (
            <DialogContentText>
              Are you sure you want to delete the course "
              {selectedCourse?.title}"?
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
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                multiline
                rows={4}
                fullWidth
                margin="normal"
                autoComplete="off"
              />
              <FormControl fullWidth margin="normal" sx={{ mt: 2 }}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleFormChange}
                  required
                  label="Category"
                >
                  <MenuItem value="">
                    <em>Select Category</em>
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal" sx={{ mt: 2 }}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  required
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="hidden">Hidden</MenuItem>
                </Select>
              </FormControl>
              <Button variant="contained" component="label" sx={{ mt: 2 }}>
                Upload Thumbnail
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              {formData.thumbnail && (
                <Typography sx={{ mt: 1 }}>
                  Selected: {formData.thumbnail.name}
                </Typography>
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

export default CourseList;
