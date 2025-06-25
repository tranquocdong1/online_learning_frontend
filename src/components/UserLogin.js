import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // ✅ ĐÚNG

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
    <Container maxWidth="xs">
      <Box
        component="form"
        onSubmit={handleSubmit}
        autoComplete="off"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          mt: 8,
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h5" align="center">
          Login
        </Typography>
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          fullWidth
          autoComplete="new-email"
          InputProps={{
            sx: {
              backgroundColor: 'white',
              '& input': {
                backgroundColor: 'transparent !important',
                '&:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 1000px white inset !important',
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
          autoComplete="new-password"
          InputProps={{
            sx: {
              backgroundColor: 'white',
              '& input': {
                backgroundColor: 'transparent !important',
                '&:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 1000px white inset !important',
                  WebkitTextFillColor: 'black !important',
                },
              },
            },
          }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          LOGIN
        </Button>
        <Button
          onClick={() => navigate('/forgot-password')}
          color="secondary"
          fullWidth
          sx={{ textTransform: 'uppercase' }}
        >
          Forgot Password?
        </Button>
        <Button
          onClick={() => navigate('/register')}
          color="secondary"
          sx={{ textTransform: 'uppercase' }}
        >
          Don't have an account? Register
        </Button>
      </Box>
    </Container>
  );
};

export default UserLogin;