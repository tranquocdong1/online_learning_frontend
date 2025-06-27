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

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();

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

  // Shared InputProps to avoid autofill issues
  const inputProps = {
    sx: {
      backgroundColor: "white",
      borderRadius: 2,
      "& input": {
        backgroundColor: "transparent !important",
        "&:-webkit-autofill": {
          WebkitBoxShadow: "0 0 0 1000px white inset !important",
          WebkitTextFillColor: "black !important",
        },
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "divider",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "primary.main",
      },
    },
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        py: 6,
        minHeight: "100vh", // Đảm bảo nền phủ toàn bộ chiều cao
        bgcolor: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", // Áp dụng gradient nền
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
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            borderRadius: 3,
            bgcolor: "background.paper", // Giữ thẻ form màu trắng để nổi bật trên nền gradient
            border: "1px solid",
            borderColor: "divider",
            transition: "transform 0.6s ease, box-shadow 0.6s ease",
            "&:hover": {
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
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
                    >
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiInputLabel-root": { fontWeight: 500 },
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
                    <IconButton onClick={handleToggleNewPassword} edge="end">
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiInputLabel-root": { fontWeight: 500 },
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
                borderColor: "divider",
                color: "text.primary",
                "&:hover": {
                  borderColor: "primary.main",
                  backgroundColor: "background.default",
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
