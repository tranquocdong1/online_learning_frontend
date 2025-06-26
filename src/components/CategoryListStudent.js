import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Container,
  Fade,
  Skeleton,
  Chip,
  IconButton,
  InputAdornment,
  TextField,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Search as SearchIcon,
  BookOutlined,
  FilterList as FilterIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
} from "@mui/icons-material";
import api from "../services/api";

const CategoryListStudent = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/categories");
        setCategories(response.data.data);
        setFilteredCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Filter categories based on search query
  useEffect(() => {
    let filtered = categories;

    if (searchQuery) {
      filtered = filtered.filter(
        (category) =>
          category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (category.description &&
            category.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredCategories(filtered);
  }, [searchQuery, categories]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  // Loading skeleton component
  const CategorySkeleton = () => (
    <Grid container spacing={3}>
      {[...Array(6)].map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card sx={{ height: 200 }}>
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

  // Category card component
  const CategoryCard = ({ category, index }) => (
    <Fade in={true} timeout={300 + index * 100}>
      <Card
        sx={{
          height: "100%",
          cursor: "pointer",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
            "& .category-icon": {
              transform: "scale(1.1)",
              color: "primary.main",
            },
          },
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        }}
      >
        <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Box
              className="category-icon"
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
                transition: "all 0.3s ease",
              }}
            >
              <BookOutlined sx={{ color: "white", fontSize: 24 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                  lineHeight: 1.3,
                  mb: 0.5,
                }}
              >
                {category.name}
              </Typography>
              <Chip
                size="small"
                label={`${category.courseCount || 0} khóa học`}
                sx={{
                  fontSize: "0.75rem",
                  height: 20,
                  bgcolor: "primary.50",
                  color: "primary.600",
                }}
              />
            </Box>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              flex: 1,
              lineHeight: 1.6,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {category.description || "Khám phá các khóa học đa dạng trong danh mục này"}
          </Typography>

          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: 500,
              }}
            >
              Cập nhật gần đây
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "primary.main",
                fontWeight: 600,
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Xem khóa học →
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            mb: 1,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Danh mục khóa học
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: "1.1rem", maxWidth: 600 }}
        >
          Khám phá các danh mục khóa học đa dạng và tìm kiếm kiến thức phù hợp với bạn
        </Typography>
      </Box>

      {/* Search and Filter Section */}
      <Box
        sx={{
          mb: 4,
          p: 3,
          bgcolor: "background.paper",
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm danh mục..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", justifyContent: { xs: "flex-start", md: "flex-end" }, gap: 1 }}>
              <IconButton
                onClick={() => handleViewModeChange("grid")}
                color={viewMode === "grid" ? "primary" : "default"}
                sx={{
                  border: "1px solid",
                  borderColor: viewMode === "grid" ? "primary.main" : "divider",
                }}
              >
                <GridViewIcon />
              </IconButton>
              <IconButton
                onClick={() => handleViewModeChange("list")}
                color={viewMode === "list" ? "primary" : "default"}
                sx={{
                  border: "1px solid",
                  borderColor: viewMode === "list" ? "primary.main" : "divider",
                }}
              >
                <ListViewIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Content Section */}
      {loading ? (
        <CategorySkeleton />
      ) : filteredCategories.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            bgcolor: "background.paper",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <BookOutlined sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchQuery ? "Không tìm thấy danh mục phù hợp" : "Chưa có danh mục nào"}
          </Typography>
          <Typography variant="body2" color="text.disabled">
            {searchQuery
              ? "Thử thay đổi từ khóa tìm kiếm của bạn"
              : "Các danh mục khóa học sẽ được hiển thị tại đây"}
          </Typography>
        </Box>
      ) : (
        <>
          {/* Results info */}
          <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Hiển thị {filteredCategories.length} danh mục
              {searchQuery && ` cho "${searchQuery}"`}
            </Typography>
          </Box>

          {/* Categories Grid */}
          <Grid container spacing={3}>
            {filteredCategories.map((category, index) => (
              <Grid
                item
                xs={12}
                sm={viewMode === "list" ? 12 : 6}
                md={viewMode === "list" ? 12 : 4}
                key={category.id}
              >
                <CategoryCard category={category} index={index} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default CategoryListStudent;