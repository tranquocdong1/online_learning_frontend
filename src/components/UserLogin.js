import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Link as MuiLink, Card, CardContent } from '@mui/material';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // ✅ ĐÚNG
import { LockOutlined } from '@mui/icons-material'; // Adding an icon for the login form

const UserLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', formData);
      const token = response.data.token;
      localStorage.setItem('token', token); // Lưu token

      // Giải mã token để lấy userId
      const decodedToken = jwtDecode(token);
      localStorage.setItem('userId', decodedToken.id); // Lưu userId từ token

      toast.success('Login successful');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', py: 4 }}>
      <Card
        elevation={10} // Increased elevation for a more prominent card, similar to the dashboard cards on hover
        sx={{
          width: '100%',
          maxWidth: 400, // Explicitly define max width for better control
          borderRadius: 3, // More rounded corners
          overflow: 'hidden',
          position: 'relative',
          background: 'white', // Ensure white background for clarity
          '&::before': { // Subtle gradient border effect
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 8, // Thicker top border
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', // A specific gradient for the login theme
            borderRadius: '12px 12px 0 0', // Match card border radius
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
            pt: 4, // More padding at the top to account for the pseudo-element border
            pb: 4, // More padding at the bottom
            px: 4, // Padding on sides
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <LockOutlined sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} /> {/* Icon for visual appeal */}
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
            variant="outlined" // Use outlined variant for a cleaner look
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2, // Match card border radius
                backgroundColor: 'grey.50', // Light grey background for input
                '& fieldset': { borderColor: 'grey.300' }, // Subtle border color
                '&:hover fieldset': { borderColor: 'primary.main' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '2px' },
              },
            }}
            InputProps={{
              sx: {
                backgroundColor: 'transparent !important', // Ensure this still works for autofill
                '& input': {
                  backgroundColor: 'transparent !important',
                  '&:-webkit-autofill': {
                    WebkitBoxShadow: '0 0 0 1000px #f0f0f0 inset !important', // Slightly adjusted autofill color
                    WebkitTextFillColor: 'black !important',
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
            variant="outlined" // Use outlined variant
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'grey.50',
                '& fieldset': { borderColor: 'grey.300' },
                '&:hover fieldset': { borderColor: 'primary.main' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '2px' },
              },
            }}
            InputProps={{
              sx: {
                backgroundColor: 'transparent !important',
                '& input': {
                  backgroundColor: 'transparent !important',
                  '&:-webkit-autofill': {
                    WebkitBoxShadow: '0 0 0 1000px #f0f0f0 inset !important',
                    WebkitTextFillColor: 'black !important',
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
              mt: 2, // Margin top for spacing
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)', // Gradient from admin dashboard
              py: 1.5,
              borderRadius: 2.5, // Slightly more rounded than inputs
              fontWeight: 'bold',
              fontSize: '1rem',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                background: 'linear-gradient(45deg, #764ba2 30%, #667eea 90%)', // Subtle gradient change on hover
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
              alignSelf: 'center', // Changed from 'flex-end' to 'center'
              color: 'primary.main',
              textDecoration: 'none',
              fontWeight: 500,
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Forgot Password?
          </MuiLink>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, pt: 2, borderTop: '1px dashed', borderColor: 'grey.300' }}>
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