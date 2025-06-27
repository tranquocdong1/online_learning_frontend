import React from 'react';
import { Container, Typography, Box, Button, Card, CardContent, Grid, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import { Person, Lock, School, Dashboard as DashboardIcon } from '@mui/icons-material';
import LogoutButton from '../components/LogoutButton';
import CategoryListStudent from '../components/CategoryListStudent';
import ThemeToggleButton from '../components/ThemeToggleButton';
import { useTheme } from '../contexts/ThemeContext';

const DashboardPage = () => {
  const { isDarkMode } = useTheme();
  
  const menuItems = [
    {
      title: 'Xem/Chỉnh sửa Hồ sơ',
      description: 'Quản lý thông tin cá nhân và cài đặt của bạn',
      path: '/profile',
      icon: <Person sx={{ fontSize: 32 }} />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      hoverShadow: '0 20px 40px rgba(102, 126, 234, 0.3)'
    },
    {
      title: 'Đổi mật khẩu',
      description: 'Cập nhật thông tin bảo mật tài khoản của bạn',
      path: '/change-password',
      icon: <Lock sx={{ fontSize: 32 }} />,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      hoverShadow: '0 20px 40px rgba(240, 147, 251, 0.3)'
    },
    {
      title: 'Khám phá các khóa học',
      description: 'Khám phá và tham gia các khóa học',
      path: '/courses',
      icon: <School sx={{ fontSize: 32 }} />,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      hoverShadow: '0 20px 40px rgba(79, 172, 254, 0.3)'
    }
  ];

  const backgroundGradient = isDarkMode 
    ? 'linear-gradient(135deg, #0f1419 0%, #1a202c 100%)'
    : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';

  return (
    <Box sx={{
      minHeight: '100vh',
      background: backgroundGradient,
      py: 4,
      position: 'relative'
    }}>
      {/* Theme Toggle Button - Floating */}
      <ThemeToggleButton variant="floating" />

      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{
          textAlign: 'center',
          mb: 6,
          position: 'relative'
        }}>
          {/* Theme Toggle in Header */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            display: { xs: 'none', md: 'block' }
          }}>
            <ThemeToggleButton />
          </Box>

          <Box sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            position: 'relative'
          }}>
            <Avatar sx={{
              width: 80,
              height: 80,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: isDarkMode 
                ? '0 8px 32px rgba(102, 126, 234, 0.5)' 
                : '0 8px 32px rgba(102, 126, 234, 0.3)',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%, 100%': {
                  transform: 'scale(1)',
                },
                '50%': {
                  transform: 'scale(1.05)',
                },
              },
            }}>
              <DashboardIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Box sx={{
              position: 'absolute',
              width: 100,
              height: 100,
              borderRadius: '50%',
              border: `2px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.4)' : 'rgba(102, 126, 234, 0.2)'}`,
              animation: 'spin 20s linear infinite',
              '@keyframes spin': {
                from: {
                  transform: 'rotate(0deg)',
                },
                to: {
                  transform: 'rotate(360deg)',
                },
              },
            }} />
          </Box>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              animation: 'fadeInUp 1s ease-out',
              '@keyframes fadeInUp': {
                from: {
                  opacity: 0,
                  transform: 'translateY(30px)',
                },
                to: {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              },
            }}
          >
            Chào mừng đến với Bảng điều khiển của bạn
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: 600,
              mx: 'auto',
              animation: 'fadeInUp 1s ease-out 0.2s both',
            }}
          >
            Quản lý hành trình học tập và khám phá các cơ hội mới với nền tảng toàn diện của chúng tôi
          </Typography>
        </Box>

        {/* Action Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {menuItems.map((item, index) => (
            <Grid item xs={12} md={4} key={item.path}>
              <Card sx={{
                height: '100%',
                background: isDarkMode 
                  ? 'rgba(30, 41, 59, 0.9)' 
                  : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                border: isDarkMode 
                  ? '1px solid rgba(255, 255, 255, 0.1)' 
                  : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 3,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`,
                '@keyframes slideInUp': {
                  from: {
                    opacity: 0,
                    transform: 'translateY(50px)',
                  },
                  to: {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: isDarkMode 
                    ? item.hoverShadow.replace('0.3', '0.5')
                    : item.hoverShadow,
                  '& .card-icon': {
                    transform: 'scale(1.1) rotate(5deg)',
                  },
                  '& .card-bg': {
                    opacity: isDarkMode ? 0.15 : 0.1,
                    transform: 'scale(1.1)',
                  }
                }
              }}>
                <Box
                  className="card-bg"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: item.gradient,
                    opacity: isDarkMode ? 0.08 : 0.05,
                    transition: 'all 0.3s ease',
                  }}
                />

                <CardContent sx={{
                  p: 4,
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <Box
                    className="card-icon"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: item.gradient,
                      color: 'white',
                      mb: 3,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: isDarkMode 
                        ? '0 8px 25px rgba(0,0,0,0.3)' 
                        : '0 8px 25px rgba(0,0,0,0.15)',
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Typography variant="h6" sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: 'text.primary'
                  }}>
                    {item.title}
                  </Typography>

                  <Typography variant="body2" sx={{
                    color: 'text.secondary',
                    mb: 3,
                    lineHeight: 1.6
                  }}>
                    {item.description}
                  </Typography>

                  <Button
                    variant="contained"
                    component={Link}
                    to={item.path}
                    fullWidth
                    sx={{
                      background: item.gradient,
                      border: 'none',
                      borderRadius: 2,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '1rem',
                      boxShadow: 'none',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: item.gradient,
                        boxShadow: isDarkMode 
                          ? '0 8px 25px rgba(0,0,0,0.4)' 
                          : '0 8px 25px rgba(0,0,0,0.2)',
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    Bắt đầu
                  </Button>
                </CardContent>

                {/* Decorative Elements */}
                <Box sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  width: 80,
                  height: 80,
                  background: isDarkMode 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  filter: 'blur(20px)',
                  transition: 'transform 0.5s ease',
                  '.card:hover &': {
                    transform: 'scale(1.5)',
                  }
                }} />
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Logout Section */}
        <Box sx={{
          textAlign: 'center',
          mb: 6,
          animation: 'fadeIn 1s ease-out 0.8s both',
          '@keyframes fadeIn': {
            from: {
              opacity: 0,
            },
            to: {
              opacity: 1,
            },
          },
        }}>
          <Card sx={{
            display: 'inline-block',
            background: isDarkMode 
              ? 'rgba(30, 41, 59, 0.9)' 
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            border: isDarkMode 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 3,
            px: 4,
            py: 2
          }}>
            <LogoutButton />
          </Card>
        </Box>

        {/* Categories Section */}
        <Box sx={{
          background: isDarkMode 
            ? 'rgba(30, 41, 59, 0.9)' 
            : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          border: isDarkMode 
            ? '1px solid rgba(255, 255, 255, 0.1)' 
            : '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 3,
          p: 4,
          animation: 'slideInUp 0.8s ease-out 0.6s both',
        }}>
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              mb: 4,
              fontWeight: 600,
              color: 'text.primary'
            }}
          >
            Danh mục khóa học
          </Typography>
          <CategoryListStudent />
        </Box>
      </Container>
    </Box>
  );
};

export default DashboardPage;