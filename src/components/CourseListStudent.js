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
  Container,
  Chip,
  Skeleton,
  Fade,
  InputAdornment,
  IconButton,
  Pagination,
} from "@mui/material";
import {
  Search as SearchIcon,
  PlayArrow as PlayIcon,
  BookOutlined,
  AccessTime,
  Person,
  Clear as ClearIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import api from "../services/api";
import ImageSlider from "./ImageSlider";
import UserMenu from "./UserMenu";
import ThemeToggleButton from "../components/ThemeToggleButton"; // Thêm import ThemeToggleButton
import { useTheme } from "../contexts/ThemeContext"; // Thêm import ThemeContext

const CourseListStudent = () => {
  const { isDarkMode } = useTheme(); // Lấy trạng thái isDarkMode từ ThemeContext
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const limit = 6;
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
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
    setLoading(true);
    try {
      const params = { page: currentPage, limit };
      if (selectedCategory) params.categoryId = selectedCategory;
      if (searchKeyword) params.search = searchKeyword;

      const response = await api.get("/api/public-courses", { params });
      const coursesWithDetails = await Promise.all(
        response.data.data.map(async (course) => {
          const chapters = await api.get(`/api/courses/${course.id}/chapters`);
          const lessonsCount = chapters.data.data.reduce((total, chapter) => {
            return total + (chapter.lesson_count || 0);
          }, 0);

          const progressResponse = await api.get(`/api/courses/${course.id}/progress`);
          const enrolledUsers = progressResponse.data.data?.enrolledUsers || 0;

          return {
            ...course,
            lessonCount: lessonsCount,
            enrolledUsers: enrolledUsers,
          };
        })
      );
      setCourses(coursesWithDetails);
      setTotalPages(response.data.pages);
      setTotalCourses(response.data.total);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, page) => setCurrentPage(page);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
    setSelectedCategory("");
    setCurrentPage(1);
  };

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}/content`);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  // Course Card Skeleton
  const CourseSkeleton = () => (
    <Grid container spacing={3}>
      {[...Array(limit)].map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card sx={{ height: 400, background: isDarkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)' }}>
            <Skeleton variant="rectangular" height={200} />
            <CardContent>
              <Skeleton variant="text" width="80%" height={32} />
              <Skeleton variant="text" width="100%" height={20} sx={{ mt: 1 }} />
              <Skeleton variant="text" width="60%" height={20} />
              <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  // Course Card Component
  const CourseCard = ({ course, index }) => (
    <Fade in={true} timeout={300 + index * 100}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-12px)",
            boxShadow: isDarkMode ? "0 20px 40px rgba(0,0,0,0.3)" : "0 20px 40px rgba(0,0,0,0.15)",
            "& .course-thumbnail": {
              transform: "scale(1.05)",
            },
            "& .play-button": {
              opacity: 1,
              transform: "scale(1)",
            },
          },
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid",
          borderColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "divider",
          background: isDarkMode ? "rgba(30, 41, 59, 0.9)" : "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(20px)",
        }}
        onClick={() => handleCourseClick(course.id)}
      >
        <Box sx={{ position: "relative", overflow: "hidden" }}>
          <CardMedia
            className="course-thumbnail"
            component="img"
            height="200"
            image={
              course.thumbnail ||
              `https://via.placeholder.com/400x200/667eea/ffffff?text=${encodeURIComponent(course.title)}`
            }
            alt={course.title}
            sx={{
              transition: "transform 0.3s ease",
              objectFit: "cover",
            }}
          />

          <Box
            className="play-button"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) scale(0.8)",
              opacity: 0,
              transition: "all 0.3s ease",
              bgcolor: "rgba(0,0,0,0.7)",
              borderRadius: "50%",
              width: 60,
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PlayIcon sx={{ color: "white", fontSize: 32, ml: 0.5 }} />
          </Box>

          <Chip
            label={course.Category?.name || "Chưa phân loại"}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              bgcolor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.9)",
              backdropFilter: "blur(10px)",
              fontWeight: 600,
              fontSize: "0.75rem",
              color: isDarkMode ? "white" : "text.primary",
            }}
          />
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: "text.primary",
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: "2.6em",
            }}
          >
            {course.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              lineHeight: 1.6,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: "4.8em",
              mb: 2,
            }}
          >
            {course.description || "Khám phá nội dung thú vị trong khóa học này"}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <AccessTime sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">
                {course.lessonCount} bài học
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Person sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">
                {course.enrolledUsers} học viên
              </Typography>
            </Box>
          </Box>
        </CardContent>

        <Box sx={{ p: 3, pt: 0 }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<PlayIcon />}
            sx={{
              py: 1.5,
              fontWeight: 600,
              borderRadius: 2,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Bắt đầu học
          </Button>
        </Box>
      </Card>
    </Fade>
  );

  // Gradient nền cho toàn bộ trang
  const backgroundGradient = isDarkMode 
    ? 'linear-gradient(135deg, #0f1419 0%, #1a202c 100%)'
    : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';

  return (
    <Box sx={{
      minHeight: '100vh',
      background: backgroundGradient,
      py: 4,
      position: 'relative'
    }}>
      {/* Theme Toggle Button - Floating */}
      <ThemeToggleButton variant="floating" />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header and User Settings */}
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", position: 'relative' }}>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: "text.primary",
                mb: 1,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Khám phá khóa học
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1.1rem", maxWidth: 600 }}>
              Tìm kiếm và tham gia các khóa học phù hợp với nhu cầu học tập của bạn
            </Typography>
          </Box>
      
          {/* Render the UserMenu component */}
          <UserMenu />
        </Box>

        {/* Static Image Slider Component */}
        <ImageSlider />

        {/* Search and Filter Section */}
        <Box sx={{
          mb: 4,
          p: 3,
          bgcolor: isDarkMode ? "rgba(30, 41, 59, 0.9)" : "background.paper",
          borderRadius: 3,
          border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid",
          borderColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "divider",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
        }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Danh mục</InputLabel>
                <Select value={selectedCategory} onChange={handleCategoryChange} label="Danh mục" sx={{ borderRadius: 2 }}>
                  <MenuItem value="">
                    <em>Tất cả danh mục</em>
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <BookOutlined sx={{ fontSize: 18, color: "primary.main" }} />
                        {category.name}
                        {category.courseCount && (
                          <Chip size="small" label={category.courseCount} sx={{ ml: 1, height: 20, fontSize: "0.7rem" }} />
                        )}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                label="Tìm kiếm khóa học"
                variant="outlined"
                value={searchKeyword}
                onChange={handleSearchChange}
                onKeyDown={(e) => { if (e.key === "Enter") setCurrentPage(1); }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: searchKeyword && (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClearSearch} size="small">
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <IconButton
                  onClick={() => handleViewModeChange("grid")}
                  color={viewMode === "grid" ? "primary" : "default"}
                  sx={{ border: "1px solid", borderColor: viewMode === "grid" ? "primary.main" : "divider" }}
                >
                  <GridViewIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleViewModeChange("list")}
                  color={viewMode === "list" ? "primary" : "default"}
                  sx={{ border: "1px solid", borderColor: viewMode === "list" ? "primary.main" : "divider" }}
                >
                  <ListViewIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>

          {(selectedCategory || searchKeyword) && (
            <Box sx={{ mt: 2, display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                Bộ lọc đang áp dụng:
              </Typography>
              {selectedCategory && (
                <Chip
                  label={`Danh mục: ${categories.find((c) => c.id == selectedCategory)?.name}`}
                  onDelete={() => setSelectedCategory("")}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {searchKeyword && (
                <Chip
                  label={`Tìm kiếm: "${searchKeyword}"`}
                  onDelete={() => setSearchKeyword("")}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              <Button size="small" onClick={handleClearSearch} sx={{ ml: 1, textTransform: "none" }}>
                Xóa tất cả
              </Button>
            </Box>
          )}
        </Box>

        {/* Course Count Display */}
        {!loading && (
          <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Hiển thị {courses.length} trong tổng số {totalCourses} khóa học
              {searchKeyword && ` cho "${searchKeyword}"`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Trang {currentPage} / {totalPages}
            </Typography>
          </Box>
        )}

        {/* Course List or Skeletons/No Results */}
        {loading ? (
          <CourseSkeleton />
        ) : courses.length === 0 ? (
          <Box sx={{
            textAlign: "center",
            py: 8,
            bgcolor: isDarkMode ? "rgba(30, 41, 59, 0.9)" : "background.paper",
            borderRadius: 3,
            border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid",
            borderColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "divider"
          }}>
            <BookOutlined sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {searchKeyword || selectedCategory ? "Không tìm thấy khóa học phù hợp" : "Chưa có khóa học nào"}
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
              {searchKeyword || selectedCategory ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm" : "Các khóa học sẽ được hiển thị tại đây"}
            </Typography>
            {(searchKeyword || selectedCategory) && (
              <Button variant="outlined" onClick={handleClearSearch} startIcon={<ClearIcon />}>
                Xóa bộ lọc
              </Button>
            )}
          </Box>
        ) : (
          <Grid container spacing={3}>
            {courses.map((course, index) => (
              <Grid item xs={12} sm={viewMode === "list" ? 12 : 6} md={viewMode === "list" ? 12 : 4} key={course.id}>
                <CourseCard course={course} index={index} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <Box sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              sx={{ "& .MuiPaginationItem-root": { borderRadius: 2, fontWeight: 600 } }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CourseListStudent;