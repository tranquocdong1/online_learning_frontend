import React, { useState } from "react";
import {
  Box,
  IconButton,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Person, Lock, ExitToApp, Login } from "@mui/icons-material";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isAuthenticated = !!localStorage.getItem('token');

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

  // Improved login button when not authenticated
  if (!isAuthenticated) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Mobile version - Icon only */}
        {isMobile ? (
          <Tooltip title="Đăng nhập" arrow>
            <IconButton
              onClick={() => navigate('/login')}
              sx={{
                p: 1,
                borderRadius: 2,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                '&:hover': {
                  bgcolor: 'primary.dark',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              }}
              aria-label="Đăng nhập"
            >
              <Login fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : (
          /* Desktop version - Button with text */
          <Button
            variant="contained"
            startIcon={<Login />}
            onClick={() => navigate('/login')}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 3,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.95rem',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: 'primary.dark',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
              '&:focus': {
                outline: '2px solid',
                outlineColor: 'primary.light',
                outlineOffset: '2px',
              },
            }}
          >
            Đăng nhập
          </Button>
        )}
      </Box>
    );
  }

  // Authenticated user menu (unchanged)
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Tooltip title="Tài khoản" arrow>
        <IconButton
          onClick={handleMenuOpen}
          sx={{
            p: 0,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'scale(1.05)',
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
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              },
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
          elevation: 0,
          sx: {
            mt: 1.5,
            minWidth: 200,
            borderRadius: 3,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            '& .MuiMenuItem-root': {
              py: 1.5,
              px: 2,
              borderRadius: 1.5,
              mx: 1,
              mb: 0.5,
              transition: 'all 0.2s ease',
              '&:last-child': {
                mb: 1,
              },
              '&:hover': {
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
              },
            },
          },
        }}
      >
        <MenuItem onClick={() => handleNavigate('/profile')}>
          <Person sx={{ mr: 1.5, color: 'action.active' }} />
          <Typography variant="body2" fontWeight={500}>Hồ sơ</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleNavigate('/change-password')}>
          <Lock sx={{ mr: 1.5, color: 'action.active' }} />
          <Typography variant="body2" fontWeight={500}>Đổi mật khẩu</Typography>
        </MenuItem>
        <LogoutButton handleCloseMenu={handleMenuClose} />
      </Menu>
    </Box>
  );
};

export default UserMenu;