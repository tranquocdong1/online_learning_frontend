import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Fade,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { toast } from "react-toastify";
import { Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useTheme } from '../contexts/ThemeContext';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();

  const { isDarkMode } = useTheme();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put("/users/change-password", formData);
      toast.success("Đổi mật khẩu thành công");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Đổi mật khẩu thất bại");
    }
  };

  // Toggle password visibility
  const handleToggleCurrentPassword = () =>
    setShowCurrentPassword(!showCurrentPassword);
  const handleToggleNewPassword = () => setShowNewPassword(!showNewPassword);

  const inputProps = {
    sx: {
      backgroundColor: isDarkMode ? 'grey.800' : 'white', // Nền input
      borderRadius: 2,
      '& input': {
        color: 'text.primary',
        backgroundColor: 'transparent !important',
        '&:-webkit-autofill': {
          WebkitBoxShadow: isDarkMode ? '0 0 0 1000px #333333 inset !important' : '0 0 0 1000px white inset !important',
          WebkitTextFillColor: isDarkMode ? 'white !important' : 'black !important',
        },
      },
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: isDarkMode ? 'grey.700' : 'divider', // Màu viền
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'primary.main',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'primary.main',
      },
    },
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        py: 6,
        minHeight: "100vh",
        background: isDarkMode
          ? "linear-gradient(135deg, #1a202c 0%, #2d3748 100%)" // Darker gradient for dark mode
          : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", // Original light gradient
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
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
          Đổi Mật Khẩu
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: "1.1rem", maxWidth: 600, mx: "auto" }}
        >
          Cập nhật mật khẩu của bạn để bảo mật tài khoản
        </Typography>
      </Box>

      {/* Form Card */}
      <Fade in={true} timeout={500}>
        <Box
          sx={{
            mt: 4,
            p: { xs: 2, sm: 4 },
            boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.5)" : "0 2px 12px rgba(0,0,0,0.04)",
            borderRadius: 3,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: isDarkMode ? "grey.800" : "divider",
            transition: "transform 0.6s ease, box-shadow 0.6s ease",
            "&:hover": {
              boxShadow: isDarkMode ? "0 25px 50px rgba(0,0,0,0.4)" : "0 20px 40px rgba(0,0,0,0.15)",
              transform: "translateY(-8px)",
            },
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            autoComplete="off"
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <TextField
              label="Mật khẩu hiện tại"
              name="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              value={formData.currentPassword}
              onChange={handleChange}
              required
              fullWidth
              autoComplete="current-password"
              InputProps={{
                ...inputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleToggleCurrentPassword}
                      edge="end"
                      sx={{ color: 'text.secondary' }}
                    >
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiInputLabel-root": { fontWeight: 500, color: 'text.secondary' },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                },
              }}
            />
            <TextField
              label="Mật khẩu mới"
              name="newPassword"
              type={showNewPassword ? "text" : "password"}
              value={formData.newPassword}
              onChange={handleChange}
              required
              fullWidth
              autoComplete="new-password"
              InputProps={{
                ...inputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleToggleNewPassword}
                      edge="end"
                      sx={{ color: 'text.secondary' }}
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiInputLabel-root": { fontWeight: 500, color: 'text.secondary' },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                py: 1.5,
                fontWeight: 600,
                borderRadius: 2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Đổi Mật Khẩu
            </Button>
            <Button
              onClick={() => navigate("/courses")}
              variant="outlined"
              fullWidth
              sx={{
                py: 1.5,
                fontWeight: 600,
                borderRadius: 2,
                borderColor: isDarkMode ? 'grey.700' : 'divider',
                color: 'text.primary',
                "&:hover": {
                  borderColor: 'primary.main',
                  backgroundColor: isDarkMode ? 'grey.800' : 'background.default',
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Hủy
            </Button>
          </Box>
        </Box>
      </Fade>
    </Container>
  );
};

export default ChangePassword;