import React from 'react';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Xác định role dựa trên URL hiện tại hoặc token
      const currentPath = window.location.pathname;
      const adminToken = localStorage.getItem('accessToken');
      const userToken = localStorage.getItem('token');
      
      if (currentPath.startsWith('/admin') || adminToken) {
        // Admin logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        toast.success('Admin logged out successfully');
        navigate('/admin/login');
      } else if (userToken) {
        // User logout - gọi API logout
        try {
          await api.post('/auth/logout');
          localStorage.removeItem('token');
          toast.success('Logged out successfully');
          navigate('/login');
        } catch (error) {
          // Nếu API thất bại, vẫn xóa token
          console.error('Logout API failed:', error);
          localStorage.removeItem('token');
          toast.success('Logged out successfully');
          navigate('/login');
        }
      } else {
        // Không có token, redirect về login
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Cleanup tất cả token
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      toast.error('Logout completed');
      navigate('/login');
    }
  };

  return (
    <Button variant="contained" color="secondary" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;