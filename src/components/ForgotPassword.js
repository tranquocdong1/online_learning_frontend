import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('Password reset email sent');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Request failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        component="form"
        onSubmit={handleSubmit}
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
          Forgot Password
        </Typography>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Send Reset Link
        </Button>
        <Button onClick={() => navigate('/login')} color="secondary" fullWidth>
          Back to Login
        </Button>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
