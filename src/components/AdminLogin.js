import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import api from "../services/api";

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/admin/login", { username, password });
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      toast.success("Login successful");
      onLogin();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 400,
        margin: "auto",
        mt: 8, // Tăng margin top để căn giữa theo chiều dọc tốt hơn
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Admin Login
      </Typography>
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        fullWidth
        variant="outlined"
        autoComplete="off" // Tắt autocomplete của trình duyệt
        InputLabelProps={{
          shrink: true, // Giữ label cố định
        }}
        sx={{
          "& .MuiInputBase-root": {
            minHeight: 56, // Cố định chiều cao input
            fontSize: "1rem",
          },
          "& .MuiInputLabel-root": {
            transform: "translate(14px, -9px) scale(0.75)", // Cố định vị trí label
            transformOrigin: "top left",
          },
        }}
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
        variant="outlined"
        autoComplete="new-password" // Tắt autocomplete cho password
        InputLabelProps={{
          shrink: true, // Giữ label cố định
        }}
        sx={{
          "& .MuiInputBase-root": {
            minHeight: 56, // Cố định chiều cao input
            fontSize: "1rem",
          },
          "& .MuiInputLabel-root": {
            transform: "translate(14px, -9px) scale(0.75)", // Cố định vị trí label
            transformOrigin: "top left",
          },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading}
        sx={{ mt: 2, py: 1.5 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
      </Button>
    </Box>
  );
};

export default AdminLogin;
