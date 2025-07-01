import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Avatar,
  CircularProgress,
  InputAdornment,
  Fade,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import { toast } from "react-toastify";
import { Person, Email, UploadFile } from "@mui/icons-material";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import NotesTab from "../components/NotesTab"; // Import NotesTab

const UserProfile = () => {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    full_name: "",
    avatar: "",
  });
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    avatar: null,
  });
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [progressHistory, setProgressHistory] = useState([]);
  const [previewAvatar, setPreviewAvatar] = useState(null); // State cho preview avatar
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users/profile");
      setProfile(response.data);
      setFormData({
        username: response.data.username,
        full_name: response.data.full_name,
        avatar: null,
      });
      setPreviewAvatar(null); // Reset preview khi tải lại profile
    } catch (error) {
      toast.error("Không tải được hồ sơ");
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchProgressHistory = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await api.get(`/api/users/${userId}/progress`);
      setProgressHistory(response.data.data || []);
    } catch (error) {
      toast.error("Không tải được lịch sử học tập");
      console.error("Error fetching progress:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchProgressHistory();
  }, [navigate]);

  const handleChange = (e) => {
    if (e.target.name === "avatar") {
      const file = e.target.files[0];
      if (file) {
        if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
          toast.error("Chỉ chấp nhận hình ảnh JPEG, JPG hoặc PNG");
          return;
        }
        // Tạo URL preview
        const previewURL = URL.createObjectURL(file);
        setPreviewAvatar(previewURL);
        setFormData({ ...formData, avatar: file });
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.full_name) {
      toast.error("Tên người dùng và Họ tên là bắt buộc");
      return;
    }

    const data = new FormData();
    data.append("username", formData.username);
    data.append("full_name", formData.full_name);
    if (formData.avatar) {
      data.append("avatar", formData.avatar);
    }

    try {
      setLoading(true);
      await api.put("/users/profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Cập nhật hồ sơ thành công");
      await fetchProfile(); // Cập nhật lại profile sau khi upload
    } catch (error) {
      toast.error(error.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const commonInputProps = {
    sx: {
      backgroundColor: isDarkMode ? "grey.800" : "white",
      borderRadius: 2,
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: isDarkMode ? "grey.700" : "grey.300",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "primary.main",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "primary.main",
        borderWidth: "2px",
      },
      "& input": {
        color: "text.primary",
      },
      "& input:-webkit-autofill": {
        WebkitBoxShadow: isDarkMode
          ? "0 0 0 1000px #333333 inset !important"
          : "0 0 0 1000px white inset !important",
        WebkitTextFillColor: isDarkMode
          ? "white !important"
          : "black !important",
      },
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: isDarkMode
          ? "linear-gradient(135deg, #1a202c 0%, #2d3748 100%)"
          : "linear-gradient(135deg, #e0f2f7 0%, #c1d5e0 100%)",
        overflowX: "hidden",
        py: 4,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          py: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ mb: 5, textAlign: "center" }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: { xs: "2.5rem", sm: "3rem" },
              mb: 1.5,
            }}
          >
            Hồ Sơ Người Dùng
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: "1.15rem", maxWidth: 600, mx: "auto" }}
          >
            Cập nhật thông tin cá nhân của bạn để giữ hồ sơ của bạn luôn mới.
          </Typography>
        </Box>

        <Fade in={true} timeout={700}>
          <Paper
            component="form"
            onSubmit={handleSubmit}
            autoComplete="off"
            elevation={isDarkMode ? 15 : 10}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: isDarkMode ? "grey.800" : "grey.200",
              transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
              "&:hover": {
                boxShadow: isDarkMode
                  ? "0 15px 30px rgba(0,0,0,0.5)"
                  : "0 15px 30px rgba(0,0,0,0.1)",
                transform: "translateY(-5px)",
              },
              width: "100%",
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              centered
              sx={{
                mb: 4,
                "& .MuiTabs-indicator": {
                  backgroundColor: "primary.main",
                },
              }}
            >
              <Tab label="Thông tin" />
              <Tab label="Lịch sử học tập" />
              <Tab label="Ghi chú" /> {/* Thêm tab Ghi chú */}
            </Tabs>

            {tabValue === 0 && (
              <>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
                  {loading ? (
                    <CircularProgress color="primary" size={60} />
                  ) : (
                    <Avatar
                      src={
                        previewAvatar ||
                        (profile.avatar
                          ? `http://localhost:5000${profile.avatar}`
                          : "")
                      }
                      alt={profile.full_name || "Ảnh đại diện"}
                      sx={{
                        width: 140,
                        height: 140,
                        border: "4px solid",
                        borderColor: "primary.light",
                        boxShadow: isDarkMode
                          ? "0 6px 20px rgba(0,0,0,0.4)"
                          : "0 6px 20px rgba(0,0,0,0.1)",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.08) rotate(2deg)",
                          boxShadow: isDarkMode
                            ? "0 12px 30px rgba(102, 126, 234, 0.5)"
                            : "0 12px 30px rgba(102, 126, 234, 0.5)",
                        },
                      }}
                    >
                      {!profile.avatar && !previewAvatar && (
                        <Person
                          sx={{
                            fontSize: 80,
                            color: isDarkMode ? "grey.600" : "grey.400",
                          }}
                        />
                      )}
                    </Avatar>
                  )}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 4,
                    p: 1.5,
                    bgcolor: isDarkMode ? "grey.900" : "grey.50",
                    borderRadius: 2,
                    border: "1px dashed",
                    borderColor: isDarkMode ? "grey.700" : "grey.300",
                  }}
                >
                  <Email sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Email: {profile.email || "N/A"}
                  </Typography>
                </Box>

                <TextField
                  label="Tên người dùng"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  fullWidth
                  autoComplete="new-username"
                  InputProps={{
                    ...commonInputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "primary.main" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />

                <TextField
                  label="Họ và tên"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  fullWidth
                  autoComplete="name"
                  InputProps={{
                    ...commonInputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "primary.main" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />

                <TextField
                  type="file"
                  name="avatar"
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    ...commonInputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <UploadFile sx={{ color: "primary.main" }} />
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{ accept: "image/jpeg,image/jpg,image/png" }}
                  sx={{ mb: 4 }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.8,
                    fontWeight: 700,
                    borderRadius: 2,
                    background:
                      "linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)",
                    boxShadow: "0 6px 20px rgba(0, 123, 255, 0.3)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                      transform: "translateY(-3px)",
                      boxShadow: "0 10px 30px rgba(0, 123, 255, 0.4)",
                    },
                    "&:disabled": {
                      background: isDarkMode
                        ? "linear-gradient(135deg, #333333 0%, #444444 100%)"
                        : "linear-gradient(135deg, #a7d9f8 0%, #76aae6 100%)",
                      color: isDarkMode
                        ? "rgba(255, 255, 255, 0.5)"
                        : "rgba(255, 255, 255, 0.7)",
                      boxShadow: "none",
                    },
                    transition: "all 0.3s ease-out",
                    mb: 2,
                  }}
                >
                  {loading ? (
                    <CircularProgress size={26} color="inherit" />
                  ) : (
                    "Cập nhật hồ sơ"
                  )}
                </Button>

                <Button
                  onClick={() => navigate("/courses")}
                  variant="text"
                  fullWidth
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    fontWeight: 600,
                    borderRadius: 2,
                    color: "primary.main",
                    "&:hover": {
                      backgroundColor: isDarkMode
                        ? "primary.dark"
                        : "primary.light",
                      color: "white",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Quay lại Trang chủ
                </Button>
              </>
            )}

            {tabValue === 1 && (
              <Box sx={{ mt: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 3,
                    p: 2,
                    background: isDarkMode
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: 3,
                    color: "white",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      bgcolor: "rgba(255, 255, 255, 0.2)",
                      mr: 2,
                    }}
                  >
                    📚
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                      Lịch sử học tập
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Theo dõi tiến trình học tập của bạn
                    </Typography>
                  </Box>
                </Box>

                {progressHistory.length > 0 ? (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {progressHistory.map((prog, index) => (
                      <Box
                        key={prog.id}
                        sx={{
                          position: "relative",
                          p: 3,
                          bgcolor: isDarkMode ? "grey.900" : "white",
                          borderRadius: 4,
                          border: "2px solid",
                          borderColor: isDarkMode ? "grey.800" : "grey.100",
                          boxShadow: isDarkMode
                            ? "0 8px 32px rgba(0, 0, 0, 0.3)"
                            : "0 8px 32px rgba(0, 0, 0, 0.08)",
                          transition:
                            "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          overflow: "hidden",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: isDarkMode
                              ? "0 20px 40px rgba(0, 0, 0, 0.4)"
                              : "0 20px 40px rgba(0, 0, 0, 0.15)",
                            borderColor:
                              prog.status === "completed"
                                ? "#4caf50"
                                : prog.status === "in_progress"
                                  ? "#2196f3"
                                  : "grey.300",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 4,
                            background:
                              prog.status === "completed"
                                ? "linear-gradient(90deg, #4caf50, #8bc34a)"
                                : prog.status === "in_progress"
                                  ? "linear-gradient(90deg, #2196f3, #03a9f4)"
                                  : "linear-gradient(90deg, #ff9800, #ffc107)",
                          }}
                        />

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 56,
                              height: 56,
                              borderRadius: 3,
                              bgcolor:
                                prog.status === "completed"
                                  ? "rgba(76, 175, 80, 0.1)"
                                  : prog.status === "in_progress"
                                    ? "rgba(33, 150, 243, 0.1)"
                                    : "rgba(255, 152, 0, 0.1)",
                              border: "2px solid",
                              borderColor:
                                prog.status === "completed"
                                  ? "rgba(76, 175, 80, 0.3)"
                                  : prog.status === "in_progress"
                                    ? "rgba(33, 150, 243, 0.3)"
                                    : "rgba(255, 152, 0, 0.3)",
                              flexShrink: 0,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "1.5rem",
                                filter: "grayscale(0)",
                              }}
                            >
                              {prog.status === "completed"
                                ? "✅"
                                : prog.status === "in_progress"
                                  ? "⏳"
                                  : "📖"}
                            </Typography>
                          </Box>

                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                mb: 1,
                                color: isDarkMode ? "grey.100" : "grey.900",
                                wordBreak: "break-word",
                              }}
                            >
                              {prog.Lesson.title}
                            </Typography>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 2,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                  px: 2,
                                  py: 0.5,
                                  borderRadius: 20,
                                  bgcolor:
                                    prog.status === "completed"
                                      ? "rgba(76, 175, 80, 0.15)"
                                      : prog.status === "in_progress"
                                        ? "rgba(33, 150, 243, 0.15)"
                                        : "rgba(255, 152, 0, 0.15)",
                                  border: "1px solid",
                                  borderColor:
                                    prog.status === "completed"
                                      ? "rgba(76, 175, 80, 0.3)"
                                      : prog.status === "in_progress"
                                        ? "rgba(33, 150, 243, 0.3)"
                                        : "rgba(255, 152, 0, 0.3)",
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontWeight: 600,
                                    color:
                                      prog.status === "completed"
                                        ? "#2e7d32"
                                        : prog.status === "in_progress"
                                          ? "#1565c0"
                                          : "#e65100",
                                    textTransform: "uppercase",
                                    letterSpacing: 0.5,
                                  }}
                                >
                                  {prog.status === "completed"
                                    ? "Hoàn thành"
                                    : prog.status === "in_progress"
                                      ? "Đang học"
                                      : "Chưa bắt đầu"}
                                </Typography>
                              </Box>
                            </Box>

                            {prog.completed_at && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  p: 2,
                                  borderRadius: 2,
                                  bgcolor: isDarkMode
                                    ? "rgba(255, 255, 255, 0.05)"
                                    : "rgba(0, 0, 0, 0.03)",
                                  border: "1px solid",
                                  borderColor: isDarkMode
                                    ? "rgba(255, 255, 255, 0.1)"
                                    : "rgba(0, 0, 0, 0.05)",
                                }}
                              >
                                <Typography sx={{ fontSize: "1rem" }}>
                                  📅
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: isDarkMode ? "grey.300" : "grey.600",
                                    fontWeight: 500,
                                  }}
                                >
                                  Hoàn thành:{" "}
                                  {new Date(prog.completed_at).toLocaleDateString(
                                    "vi-VN",
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    }
                                  )}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      py: 8,
                      px: 4,
                      textAlign: "center",
                      bgcolor: isDarkMode ? "grey.900" : "grey.50",
                      borderRadius: 4,
                      border: "2px dashed",
                      borderColor: isDarkMode ? "grey.700" : "grey.300",
                    }}
                  >
                    <Box
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        bgcolor: isDarkMode
                          ? "rgba(255, 255, 255, 0.05)"
                          : "rgba(0, 0, 0, 0.05)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 3,
                        fontSize: "3rem",
                      }}
                    >
                      📚
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 1,
                        fontWeight: 600,
                        color: isDarkMode ? "grey.300" : "grey.600",
                      }}
                    >
                      Chưa có lịch sử học tập
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: isDarkMode ? "grey.500" : "grey.500",
                        maxWidth: 300,
                        lineHeight: 1.6,
                      }}
                    >
                      Bắt đầu học các bài học để xem tiến trình của bạn tại đây
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {tabValue === 2 && (
              <NotesTab
                progressHistory={progressHistory}
                fetchNotesCallback={fetchProgressHistory} // Có thể dùng fetchProgressHistory nếu muốn đồng bộ
                isDarkMode={isDarkMode} // Truyền theme
              />
            )}
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default UserProfile;