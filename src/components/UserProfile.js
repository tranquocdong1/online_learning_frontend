import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    full_name: '',
    avatar: '',
  });
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    avatar: null,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/profile');
      setProfile(response.data);
      setFormData({
        username: response.data.username,
        full_name: response.data.full_name,
        avatar: null,
      });
    } catch (error) {
      toast.error('Failed to load profile');
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    if (e.target.name === 'avatar') {
      const file = e.target.files[0];
      if (
        file &&
        !['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)
      ) {
        toast.error('Only JPEG, JPG, or PNG images are allowed');
        return;
      }
      setFormData({ ...formData, avatar: file });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.full_name) {
      toast.error('Username and Full Name are required');
      return;
    }

    const data = new FormData();
    data.append('username', formData.username);
    data.append('full_name', formData.full_name);
    if (formData.avatar) {
      data.append('avatar', formData.avatar);
    }

    try {
      setLoading(true);
      await api.put('/users/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Profile updated successfully');
      await fetchProfile(); // Reuse fetchProfile logic
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

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
        component="form"
        onSubmit={handleSubmit}
        autoComplete="off"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          mt: 4,
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          User Profile
        </Typography>

        {/* Avatar Display */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Avatar
              src={
                profile.avatar ? `http://localhost:5000${profile.avatar}` : ''
              }
              alt={profile.full_name}
              sx={{ width: 100, height: 100 }}
            />
          )}
        </Box>

        {/* Email Display (Read-only) */}
        <Typography variant="body1" align="center" color="textSecondary">
          Email: {profile.email}
        </Typography>

        {/* Editable Fields */}
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
          label="Full Name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          required
          fullWidth
          autoComplete="name"
          InputProps={inputProps}
        />

        {/* Avatar Upload */}
        <Box>
          <Button variant="outlined" component="label" fullWidth>
            Upload Avatar
            <input
              type="file"
              name="avatar"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleChange}
              hidden
            />
          </Button>
          {formData.avatar && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Selected: {formData.avatar.name}
            </Typography>
          )}
        </Box>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Update Profile'}
        </Button>

        {/* Back to Dashboard */}
        <Button
          onClick={() => navigate('/dashboard')}
          color="secondary"
          fullWidth
          disabled={loading}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default UserProfile;
