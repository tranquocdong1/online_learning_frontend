import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/change-password', formData);
      toast.success('Password changed successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Change password failed');
    }
  };

  // Shared InputProps để tránh autofill issues
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
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Change Password
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          autoComplete="off"
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Current Password"
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            required
            fullWidth
            autoComplete="current-password"
            InputProps={inputProps}
          />
          <TextField
            label="New Password"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            required
            fullWidth
            autoComplete="new-password"
            InputProps={inputProps}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Change Password
          </Button>
          <Button
            onClick={() => navigate('/dashboard')}
            color="secondary"
            fullWidth
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ChangePassword;
