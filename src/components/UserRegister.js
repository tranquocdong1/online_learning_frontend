import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Link as MuiLink, Card, CardContent } from '@mui/material';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { PersonAdd } from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';

const UserRegister = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
  });
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
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
          : "linear-gradient(135deg, #e0f2f7 0%, #a7d9ed 100%)",
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
            background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
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
            <PersonAdd sx={{ fontSize: 60, color: 'secondary.main', mb: 1 }} /> {/* Registration icon */}
            <Typography variant="h4" fontWeight="bold" align="center" gutterBottom sx={{ color: 'text.primary' }}>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Join us and start your journey!
            </Typography>
          </Box>

          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            autoComplete="new-username"
            variant="outlined"
            sx={{
              '& .MuiInputLabel-root': { color: 'text.secondary' },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: isDarkMode ? 'grey.900' : 'grey.50',
                '& fieldset': { borderColor: isDarkMode ? 'grey.700' : 'grey.300' },
                '&:hover fieldset': { borderColor: 'secondary.main' },
                '&.Mui-focused fieldset': { borderColor: 'secondary.main', borderWidth: '2px' },
                '& input': { color: 'text.primary' },
              },
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
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            autoComplete="new-email"
            variant="outlined"
            sx={{
              '& .MuiInputLabel-root': { color: 'text.secondary' },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: isDarkMode ? 'grey.900' : 'grey.50',
                '& fieldset': { borderColor: isDarkMode ? 'grey.700' : 'grey.300' },
                '&:hover fieldset': { borderColor: 'secondary.main' },
                '&.Mui-focused fieldset': { borderColor: 'secondary.main', borderWidth: '2px' },
                '& input': { color: 'text.primary' },
              },
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
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            autoComplete="new-password"
            variant="outlined"
            sx={{
              '& .MuiInputLabel-root': { color: 'text.secondary' },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: isDarkMode ? 'grey.900' : 'grey.50',
                '& fieldset': { borderColor: isDarkMode ? 'grey.700' : 'grey.300' },
                '&:hover fieldset': { borderColor: 'secondary.main' },
                '&.Mui-focused fieldset': { borderColor: 'secondary.main', borderWidth: '2px' },
                '& input': { color: 'text.primary' },
              },
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
            label="Full Name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            autoComplete="name"
            variant="outlined"
            sx={{
              '& .MuiInputLabel-root': { color: 'text.secondary' },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: isDarkMode ? 'grey.900' : 'grey.50',
                '& fieldset': { borderColor: isDarkMode ? 'grey.700' : 'grey.300' },
                '&:hover fieldset': { borderColor: 'secondary.main' },
                '&.Mui-focused fieldset': { borderColor: 'secondary.main', borderWidth: '2px' },
                '& input': { color: 'text.primary' },
              },
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
            sx={{
              mt: 2,
              background: 'linear-gradient(45deg, #4facfe 30%, #00f2fe 90%)',
              py: 1.5,
              borderRadius: 2.5,
              fontWeight: 'bold',
              fontSize: '1rem',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                background: 'linear-gradient(45deg, #00f2fe 30%, #4facfe 90%)',
              },
            }}
          >
            REGISTER
          </Button>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 3,
              pt: 2,
              borderTop: '1px dashed',
              borderColor: isDarkMode ? 'grey.700' : 'grey.300',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <MuiLink
                component="button"
                onClick={() => navigate('/login')}
                sx={{
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  color: 'primary.main',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Login
              </MuiLink>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserRegister;