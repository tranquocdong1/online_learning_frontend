import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CourseListStudent = () => {
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6; // Số khóa học trên mỗi trang
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/api/courses", {
          params: { page: currentPage, limit },
        });
        setCourses(response.data.data);
        setTotalPages(response.data.pages);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`); // Điều hướng đến trang chi tiết khóa học
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Khám phá khóa học
      </Typography>
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
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
