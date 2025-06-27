// UserProfile.js
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Avatar,
  CircularProgress,
  InputAdornment,
  Fade,
  Paper,
} from '@mui/material';
import { toast } from 'react-toastify';
import { Person, Email, UploadFile } from '@mui/icons-material';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

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

  const { isDarkMode } = useTheme();

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
      toast.error('Không tải được hồ sơ');
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
        toast.error('Chỉ chấp nhận hình ảnh JPEG, JPG hoặc PNG');
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
      toast.error('Tên người dùng và Họ tên là bắt buộc');
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
      toast.success('Cập nhật hồ sơ thành công');
      await fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  const commonInputProps = {
    sx: {
      backgroundColor: isDarkMode ? 'grey.800' : 'white',
      borderRadius: 2,
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: isDarkMode ? 'grey.700' : 'grey.300',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'primary.main',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'primary.main',
        borderWidth: '2px',
      },
      '& input': {
        color: 'text.primary',
      },
      '& input:-webkit-autofill': {
        WebkitBoxShadow: isDarkMode ? '0 0 0 1000px #333333 inset !important' : '0 0 0 1000px white inset !important',
        WebkitTextFillColor: isDarkMode ? 'white !important' : 'black !important',
      },
    },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDarkMode
          ? 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)'
          : 'linear-gradient(135deg, #e0f2f7 0%, #c1d5e0 100%)',
        overflowX: 'hidden',
        py: 4,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          py: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 5, textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2.5rem', sm: '3rem' },
              mb: 1.5,
            }}
          >
            Hồ Sơ Người Dùng
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: '1.15rem', maxWidth: 600, mx: 'auto' }}
          >
            Cập nhật thông tin cá nhân của bạn để giữ hồ sơ của bạn luôn mới.
          </Typography>
        </Box>

        {/* Form Card */}
        <Fade in={true} timeout={700}>
          <Paper
            component="form"
            onSubmit={handleSubmit}
            autoComplete="off"
            elevation={isDarkMode ? 15 : 10}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: isDarkMode ? 'grey.800' : 'grey.200',
              transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
              '&:hover': {
                boxShadow: isDarkMode ? '0 15px 30px rgba(0,0,0,0.5)' : '0 15px 30px rgba(0,0,0,0.1)', // Box shadow cho hover
                transform: 'translateY(-5px)',
              },
              width: '100%',
            }}
          >
            {/* Avatar Display */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              {loading ? (
                <CircularProgress color="primary" size={60} />
              ) : (
                <Avatar
                  src={profile.avatar ? `http://localhost:5000${profile.avatar}` : ''}
                  alt={profile.full_name || 'Ảnh đại diện'}
                  sx={{
                    width: 140,
                    height: 140,
                    border: '4px solid',
                    borderColor: 'primary.light',
                    boxShadow: isDarkMode ? '0 6px 20px rgba(0,0,0,0.4)' : '0 6px 20px rgba(0,0,0,0.1)', // Box shadow avatar
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.08) rotate(2deg)',
                      boxShadow: isDarkMode ? '0 12px 30px rgba(102, 126, 234, 0.5)' : '0 12px 30px rgba(102, 126, 234, 0.5)',
                    },
                  }}
                >
                  {!profile.avatar && (
                    <Person sx={{ fontSize: 80, color: isDarkMode ? 'grey.600' : 'grey.400' }} />
                  )}
                </Avatar>
              )}
            </Box>

            {/* Email Display (Read-only) */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 4,
                p: 1.5,
                bgcolor: isDarkMode ? 'grey.900' : 'grey.50',
                borderRadius: 2,
                border: '1px dashed',
                borderColor: isDarkMode ? 'grey.700' : 'grey.300',
              }}
            >
              <Email sx={{ color: 'text.secondary', mr: 1 }} />
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                Email: {profile.email || 'N/A'}
              </Typography>
            </Box>

            {/* Editable Fields */}
            <TextField
              label="Tên người dùng"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              fullWidth
              autoComplete="new-username"
              InputProps={{
                ...commonInputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <TextField
              label="Họ và tên"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              fullWidth
              autoComplete="name"
              InputProps={{
                ...commonInputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            {/* Avatar Upload */}
            <Box sx={{ mb: 4 }}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<UploadFile />}
                sx={{
                  py: 1.8,
                  fontWeight: 600,
                  borderRadius: 2,
                  borderColor: isDarkMode ? 'primary.dark' : 'primary.light',
                  color: isDarkMode ? 'primary.light' : 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    backgroundColor: isDarkMode ? 'primary.dark' : 'primary.light',
                    color: 'white',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 15px rgba(0, 123, 255, 0.2)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Tải lên ảnh đại diện mới
                <input
                  type="file"
                  name="avatar"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleChange}
                  hidden
                />
              </Button>
              {formData.avatar && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1.5, textAlign: 'center', fontStyle: 'italic' }}
                >
                  Đã chọn: <Box component="span" sx={{ fontWeight: 600 }}>{formData.avatar.name}</Box>
                </Typography>
              )}
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                py: 1.8,
                fontWeight: 700,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)',
                boxShadow: '0 6px 20px rgba(0, 123, 255, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 10px 30px rgba(0, 123, 255, 0.4)',
                },
                '&:disabled': {
                  background: isDarkMode ? 'linear-gradient(135deg, #333333 0%, #444444 100%)' : 'linear-gradient(135deg, #a7d9f8 0%, #76aae6 100%)',
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.7)',
                  boxShadow: 'none',
                },
                transition: 'all 0.3s ease-out',
                mb: 2,
              }}
            >
              {loading ? <CircularProgress size={26} color="inherit" /> : 'Cập nhật hồ sơ'}
            </Button>

            {/* Back to Dashboard */}
            <Button
              onClick={() => navigate('/courses')}
              variant="text"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.5,
                fontWeight: 600,
                borderRadius: 2,
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: isDarkMode ? 'primary.dark' : 'primary.light',
                  color: 'white',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Quay lại Trang chủ
            </Button>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default UserProfile;