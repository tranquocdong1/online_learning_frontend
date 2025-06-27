import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Container,
  Card,
  CardContent,
} from "@mui/material";
import { toast } from "react-toastify";
import api from "../services/api";
import { AdminPanelSettings } from "@mui/icons-material";
import { useTheme } from '../contexts/ThemeContext';

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useTheme();

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
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        py: 4,
        background: isDarkMode
          ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
          : "linear-gradient(135deg, #f8f8f8 0%, #e0e0e0 100%)",
      }}
    >
      <Card
        elevation={isDarkMode ? 15 : 10}
        sx={{
          width: '100%',
          maxWidth: 400,
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          background: isDarkMode ? 'background.paper' : 'white',
          border: '1px solid',
          borderColor: isDarkMode ? 'grey.800' : 'grey.200',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: 'linear-gradient(90deg, #764ba2 0%, #667eea 100%)',
            borderRadius: '12px 12px 0 0',
          },
        }}
      >
        <CardContent
          component="form"
          onSubmit={handleSubmit}
          autoComplete="off"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            pt: 4,
            pb: 4,
            px: 4,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <AdminPanelSettings sx={{ fontSize: 60, color: 'primary.dark', mb: 1 }} /> {/* Admin icon */}
            <Typography variant="h4" fontWeight="bold" align="center" gutterBottom sx={{ color: 'text.primary' }}>
              Admin Panel
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Log in to manage your system.
            </Typography>
          </Box>

          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            fullWidth
            margin="normal"
            variant="outlined"
            autoComplete="off"
            sx={{
              '& .MuiInputLabel-root': { color: 'text.secondary' },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: isDarkMode ? 'grey.900' : 'grey.50',
                '& fieldset': { borderColor: isDarkMode ? 'grey.700' : 'grey.300' },
                '&:hover fieldset': { borderColor: 'primary.dark' },
                '&.Mui-focused fieldset': { borderColor: 'primary.dark', borderWidth: '2px' },
                '& input': { color: 'text.primary' },
              },
            }}
            InputLabelProps={{
                shrink: true,
            }}
            InputProps={{
              sx: {
                '& input': {
                  backgroundColor: 'transparent !important',
                  '&:-webkit-autofill': {
                    WebkitBoxShadow: isDarkMode ? '0 0 0 1000px #2d3748 inset !important' : '0 0 0 1000px #f0f0f0 inset !important', // Autofill background
                    WebkitTextFillColor: isDarkMode ? 'white !important' : 'black !important',
                  },
                },
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
            margin="normal"
            variant="outlined"
            autoComplete="new-password"
            sx={{
              '& .MuiInputLabel-root': { color: 'text.secondary' },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: isDarkMode ? 'grey.900' : 'grey.50',
                '& fieldset': { borderColor: isDarkMode ? 'grey.700' : 'grey.300' },
                '&:hover fieldset': { borderColor: 'primary.dark' },
                '&.Mui-focused fieldset': { borderColor: 'primary.dark', borderWidth: '2px' },
                '& input': { color: 'text.primary' },
              },
            }}
            InputLabelProps={{
                shrink: true,
            }}
            InputProps={{
              sx: {
                '& input': {
                  backgroundColor: 'transparent !important',
                  '&:-webkit-autofill': {
                    WebkitBoxShadow: isDarkMode ? '0 0 0 1000px #2d3748 inset !important' : '0 0 0 1000px #f0f0f0 inset !important', // Autofill background
                    WebkitTextFillColor: isDarkMode ? 'white !important' : 'black !important',
                  },
                },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{
              mt: 2,
              background: 'linear-gradient(45deg, #764ba2 30%, #667eea 90%)',
              py: 1.5,
              borderRadius: 2.5,
              fontWeight: 'bold',
              fontSize: '1rem',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "LOGIN"}
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AdminLogin;