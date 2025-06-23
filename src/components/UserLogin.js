import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
  // Đảm bảo state khởi tạo hoàn toàn trống
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', formData);
      localStorage.setItem('token', response.data.token);
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
        autoComplete="off" // Tắt autocomplete
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
          autoComplete="new-email" // Ngăn autofill
          InputProps={{
            sx: {
              backgroundColor: 'white', // Đảm bảo background trắng
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
          autoComplete="new-password" // Ngăn autofill
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
          Don&apos;t have an account? Register
        </Button>
      </Box>
    </Container>
  );
};

export default UserLogin;
