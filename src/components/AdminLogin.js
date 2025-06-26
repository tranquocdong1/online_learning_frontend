import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Container, // Import Container for proper centering
  Card,      // Import Card for the wrapper
  CardContent, // Import CardContent for padding
} from "@mui/material";
import { toast } from "react-toastify";
import api from "../services/api";
import { AdminPanelSettings } from "@mui/icons-material"; // Icon for Admin Login

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
    <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', py: 4 }}>
      <Card
        elevation={10} // Prominent shadow for consistency
        sx={{
          width: '100%',
          maxWidth: 400,
          borderRadius: 3, // Rounded corners
          overflow: 'hidden',
          position: 'relative',
          background: 'white',
          '&::before': { // Gradient top border, distinct but matching theme
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: 'linear-gradient(90deg, #764ba2 0%, #667eea 100%)', // Unique gradient for admin login
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
            gap: 2, // Spacing between elements
            pt: 4, // Padding to account for the top border
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
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'grey.50',
                '& fieldset': { borderColor: 'grey.300' },
                '&:hover fieldset': { borderColor: 'primary.dark' }, // Using primary.dark for input accents
                '&.Mui-focused fieldset': { borderColor: 'primary.dark', borderWidth: '2px' },
              },
            }}
            InputLabelProps={{
                shrink: true,
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
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'grey.50',
                '& fieldset': { borderColor: 'grey.300' },
                '&:hover fieldset': { borderColor: 'primary.dark' },
                '&.Mui-focused fieldset': { borderColor: 'primary.dark', borderWidth: '2px' },
              },
            }}
            InputLabelProps={{
                shrink: true,
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
              background: 'linear-gradient(45deg, #764ba2 30%, #667eea 90%)', // Gradient from main admin header
              py: 1.5,
              borderRadius: 2.5,
              fontWeight: 'bold',
              fontSize: '1rem',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)', // Subtle gradient change on hover
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