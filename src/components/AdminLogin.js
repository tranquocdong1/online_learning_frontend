import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import api from '../services/api';

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin/login', { username, password });
      localStorage.setItem('token', response.data.token);
      toast.success('Login successful');
      onLogin();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 400,
        margin: 'auto',
        mt: 5,
        p: 3,
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" align="center">
        Admin Login
      </Typography>
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        Login
      </Button>
    </Box>
  );
};

export default AdminLogin;
