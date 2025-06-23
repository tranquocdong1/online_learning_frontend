import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';

const DashboardPage = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Your Dashboard
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
          <Button
            variant="contained"
            component={Link}
            to="/profile"
            color="primary"
          >
            View/Edit Profile
          </Button>
          <Button
            variant="contained"
            component={Link}
            to="/change-password"
            color="primary"
          >
            Change Password
          </Button>
          <LogoutButton />
        </Box>
      </Box>
    </Container>
  );
};

export default DashboardPage;
