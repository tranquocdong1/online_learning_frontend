import React, { useState } from "react";
import {
  Box,
  IconButton,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { Person, Lock, ExitToApp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import api from "../services/api";

const LogoutButton = ({ handleCloseMenu }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const userToken = localStorage.getItem('token');

      if (userToken) {
        try {
          await api.post('/auth/logout');
          localStorage.removeItem('token');
          toast.success('Đăng xuất thành công');
          navigate('/login');
        } catch (error) {
          console.error('Lỗi API đăng xuất:', error);
          localStorage.removeItem('token');
          toast.success('Đăng xuất thành công');
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
      localStorage.removeItem('token');
      toast.error('Đăng xuất hoàn tất');
      navigate('/login');
    } finally {
      handleCloseMenu();
    }
  };

  return (
    <MenuItem 
      onClick={handleLogout}
      sx={{
        color: 'error.main',
        '&:hover': {
          bgcolor: 'error.light',
          color: 'error.contrastText',
        },
      }}
    >
      <ExitToApp sx={{ mr: 1 }} />
      Đăng xuất
    </MenuItem>
  );
};

const UserMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Tooltip title="Tài khoản" arrow>
        <IconButton
          onClick={handleMenuOpen}
          sx={{
            p: 0,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)',
              bgcolor: 'primary.light',
            },
          }}
          aria-label="Mở menu tài khoản"
        >
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 },
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            <Person fontSize="large" />
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1,
            minWidth: 200,
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            '& .MuiMenuItem-root': {
              py: 1.5,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
              },
            },
          },
        }}
      >
        <MenuItem onClick={() => handleNavigate('/profile')}>
          <Person sx={{ mr: 1, color: 'action.active' }} />
          <Typography variant="body2">Hồ sơ</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleNavigate('/change-password')}>
          <Lock sx={{ mr: 1, color: 'action.active' }} />
          <Typography variant="body2">Đổi mật khẩu</Typography>
        </MenuItem>
        <LogoutButton handleCloseMenu={handleMenuClose} />
      </Menu>
    </Box>
  );
};

export default UserMenu;