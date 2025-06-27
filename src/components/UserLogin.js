import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Link as MuiLink, Card, CardContent } from '@mui/material';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { LockOutlined } from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';

const UserLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', formData);
      const token = response.data.token;
      localStorage.setItem('token', token);

      const decodedToken = jwtDecode(token);
      localStorage.setItem('userId', decodedToken.id);

      toast.success('Login successful');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
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
          : "linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)",
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
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
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
            <LockOutlined sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" align="center" gutterBottom sx={{ color: 'text.primary' }}>
              Welcome Back!
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Sign in to continue to your account.
            </Typography>
          </Box>

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
                '&:hover fieldset': { borderColor: 'primary.main' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '2px' },
                '& input': { color: 'text.primary' },
              },
            }}
            InputProps={{
              sx: {
                '& input': {
                  backgroundColor: 'transparent !important',
                  '&:-webkit-autofill': {
                    WebkitBoxShadow: isDarkMode ? '0 0 0 1000px #2d3748 inset !important' : '0 0 0 1000px #f0f0f0 inset !important', // Autofill background
                    WebkitTextFillColor: isDarkMode ? 'white !important' : 'black !important', // Autofill text color
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
                '&:hover fieldset': { borderColor: 'primary.main' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '2px' },
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
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              py: 1.5,
              borderRadius: 2.5,
              fontWeight: 'bold',
              fontSize: '1rem',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                background: 'linear-gradient(45deg, #764ba2 30%, #667eea 90%)',
              },
            }}
          >
            LOGIN
          </Button>

          <MuiLink
            component="button"
            onClick={() => navigate('/forgot-password')}
            variant="body2"
            sx={{
              mt: 1,
              alignSelf: 'center',
              color: 'primary.main',
              textDecoration: 'none',
              fontWeight: 500,
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Forgot Password?
          </MuiLink>

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
              Don't have an account?{' '}
              <MuiLink
                component="button"
                onClick={() => navigate('/register')}
                sx={{
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  color: 'primary.main',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Register
              </MuiLink>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserLogin;