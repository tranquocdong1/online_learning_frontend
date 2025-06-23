import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

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

  // Shared InputProps để tránh lặp code
  const inputProps = {
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
          Register
        </Typography>
        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          fullWidth
          autoComplete="new-username"
          InputProps={inputProps}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          fullWidth
          autoComplete="new-email"
          InputProps={inputProps}
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
          InputProps={inputProps}
        />
        <TextField
          label="Full Name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          required
          fullWidth
          autoComplete="name"
          InputProps={inputProps}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          REGISTER
        </Button>
        <Button onClick={() => navigate('/login')} color="secondary" fullWidth>
          Already have an account? Login
        </Button>
      </Box>
    </Container>
  );
};

export default UserRegister;
