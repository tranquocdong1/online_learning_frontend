//pages/AdminDashboardPage.js
import React from "react";
import { 
  Typography, 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Avatar,
  Container,
  Paper,
  Divider,
  alpha,
  Fade
} from "@mui/material";
import { 
  People, 
  Category, 
  School, 
  Dashboard,
  TrendingUp,
  Security,
  Settings
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const AdminDashboardPage = () => {
  const navigate = useNavigate();

  const managementCards = [
    {
      title: "Manage Users",
      description: "Control user accounts, permissions, and access levels",
      icon: <People sx={{ fontSize: 32 }} />,
      color: "#667eea",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      route: "/admin/users",
      stats: "Active Users"
    },
    {
      title: "Manage Categories",
      description: "Organize and structure your content categories",
      icon: <Category sx={{ fontSize: 32 }} />,
      color: "#f093fb",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      route: "/admin/categories",
      stats: "Categories"
    },
    {
      title: "Manage Courses",
      description: "Create, edit, and monitor course content and progress",
      icon: <School sx={{ fontSize: 32 }} />,
      color: "#4facfe",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      route: "/admin/courses",
      stats: "Courses"
    }
  ];

  const quickActions = [
    {
      title: "System Analytics",
      description: "View detailed system metrics and performance",
      icon: <TrendingUp />,
      color: "#43e97b"
    },
    {
      title: "Security Settings",
      description: "Configure security policies and access controls",
      icon: <Security />,
      color: "#fa709a"
    },
    {
      title: "System Settings",
      description: "Manage application configuration and preferences",
      icon: <Settings />,
      color: "#ffecd2"
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Card 
        elevation={0} 
        sx={{ 
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 200,
            height: 200,
            background: alpha('#fff', 0.1),
            borderRadius: '50%',
            transform: 'translate(50%, -50%)'
          }}
        />
        <CardContent sx={{ py: 5, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar 
              sx={{ 
                bgcolor: alpha('#fff', 0.2),
                width: 80,
                height: 80,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}
            >
              <Dashboard sx={{ fontSize: 40 }} />
            </Avatar>
            <Box>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                Admin Dashboard
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                Welcome to the admin control panel! Manage your system efficiently.
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Main Management Cards */}
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: 'text.primary' }}>
        Core Management
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {managementCards.map((card, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Fade in={true} timeout={500 + index * 200}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    borderColor: card.color,
                  }
                }}
                onClick={() => navigate(card.route)}
              >
                <Box
                  sx={{
                    height: 6,
                    background: card.gradient,
                  }}
                />
                <CardContent sx={{ p: 3, height: 'calc(100% - 6px)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: alpha(card.color, 0.1),
                        color: card.color,
                        width: 60,
                        height: 60
                      }}
                    >
                      {card.icon}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {card.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {card.description}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {card.stats}
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        background: card.gradient,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'bold',
                        px: 2,
                        '&:hover': {
                          opacity: 0.9,
                          transform: 'scale(1.05)'
                        }
                      }}
                    >
                      Manage
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

    </Container>
  );
};

export default AdminDashboardPage;