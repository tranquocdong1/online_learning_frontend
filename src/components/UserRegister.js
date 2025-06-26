import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Link as MuiLink, Card, CardContent } from '@mui/material';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { PersonAdd } from '@mui/icons-material'; // Icon for registration

const UserRegister = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
  });
  const navigate = useNavigate();

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
    <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', py: 4 }}>
      <Card
        elevation={10} // Prominent shadow like the login page
        sx={{
          width: '100%',
          maxWidth: 400,
          borderRadius: 3, // Rounded corners
          overflow: 'hidden',
          position: 'relative',
          background: 'white',
          '&::before': { // Gradient top border
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)', // Using a different gradient color from admin dashboard
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
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'grey.50',
                '& fieldset': { borderColor: 'grey.300' },
                '&:hover fieldset': { borderColor: 'secondary.main' }, // Using secondary color for register fields
                '&.Mui-focused fieldset': { borderColor: 'secondary.main', borderWidth: '2px' },
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
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'grey.50',
                '& fieldset': { borderColor: 'grey.300' },
                '&:hover fieldset': { borderColor: 'secondary.main' },
                '&.Mui-focused fieldset': { borderColor: 'secondary.main', borderWidth: '2px' },
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
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'grey.50',
                '& fieldset': { borderColor: 'grey.300' },
                '&:hover fieldset': { borderColor: 'secondary.main' },
                '&.Mui-focused fieldset': { borderColor: 'secondary.main', borderWidth: '2px' },
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
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'grey.50',
                '& fieldset': { borderColor: 'grey.300' },
                '&:hover fieldset': { borderColor: 'secondary.main' },
                '&.Mui-focused fieldset': { borderColor: 'secondary.main', borderWidth: '2px' },
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
              mt: 2,
              background: 'linear-gradient(45deg, #4facfe 30%, #00f2fe 90%)', // Gradient from admin dashboard (blue/cyan)
              py: 1.5,
              borderRadius: 2.5,
              fontWeight: 'bold',
              fontSize: '1rem',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                background: 'linear-gradient(45deg, #00f2fe 30%, #4facfe 90%)', // Subtle gradient change on hover
              },
            }}
          >
            REGISTER
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, pt: 2, borderTop: '1px dashed', borderColor: 'grey.300' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <MuiLink
                component="button"
                onClick={() => navigate('/login')}
                sx={{
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  color: 'primary.main', // Using primary color for existing account link
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