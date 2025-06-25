import React, { useState, useEffect } from "react";

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CourseListStudent = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const limit = 6;
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchCourses();
  }, [currentPage, selectedCategory, searchKeyword]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/categories", {
        params: { page: 1, limit: 100 },
      });
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const params = { page: currentPage, limit };
      if (selectedCategory) params.categoryId = selectedCategory;
      if (searchKeyword) params.search = searchKeyword;
      const response = await api.get("/api/public-courses", { params });
      setCourses(response.data.data);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
    setCurrentPage(1);
  };

  const handleCourseClick = (courseId) => {
  navigate(`/courses/${courseId}/content`);
};


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Khám phá khóa học
      </Typography>

      {/* 🔍 Thanh tìm kiếm */}
      <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
  <FormControl sx={{ flex: 1 }}>
    <InputLabel>Lọc theo danh mục</InputLabel>
    <Select
      value={selectedCategory}
      onChange={handleCategoryChange}
      label="Lọc theo danh mục"
    >
      <MenuItem value="">
        <em>Tất cả</em>
      </MenuItem>
      {categories.map((category) => (
        <MenuItem key={category.id} value={category.id}>
          {category.name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>

  <TextField
    label="Tìm kiếm"
    variant="outlined"
    value={searchKeyword}
    onChange={(e) => setSearchKeyword(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") setCurrentPage(1); // Nhấn Enter để tìm kiếm
    }}
    sx={{ flex: 1 }}
  />
</Box>


      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardMedia
                component="img"
                height="200"
                image={
                  course.thumbnail ||
                  `https://via.placeholder.com/300x200?text=${course.title}`
                }
                alt={course.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {course.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Danh mục: {course.Category?.name || "Chưa có"}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handleCourseClick(course.id)}
                >
                  Tham gia
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "contained" : "outlined"}
              color="primary"
              onClick={() => handlePageChange(page)}
              sx={{ mx: 1 }}
            >
              {page}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CourseListStudent;
