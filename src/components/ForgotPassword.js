import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Link as MuiLink, Card, CardContent } from '@mui/material';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { LockReset } from '@mui/icons-material'; // Icon for forgot password

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('Password reset email sent! Check your inbox.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Request failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', py: 4 }}>
      <Card
        elevation={10} // Prominent shadow for consistency
        sx={{
          width: '100%',
          maxWidth: 400,
          borderRadius: 3, // Rounded corners
          overflow: 'hidden',
          position: 'relative',
          background: 'white',
          '&::before': { // Gradient top border, distinct but matching theme
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: 'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)', // Using a pink/red gradient from dashboard cards
            borderRadius: '12px 12px 0 0',
          },
        }}
      >
        <CardContent
          component="form"
          onSubmit={handleSubmit}
          autoComplete="off"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2, // Spacing between elements
            pt: 4, // Padding to account for the top border
            pb: 4,
            px: 4,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <LockReset sx={{ fontSize: 60, color: 'info.main', mb: 1 }} /> {/* Icon for password reset */}
            <Typography variant="h4" fontWeight="bold" align="center" gutterBottom sx={{ color: 'text.primary' }}>
              Reset Password
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Enter your email to receive a password reset link.
            </Typography>
          </Box>

          <TextField
            label="Email Address" // More descriptive label
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'grey.50',
                '& fieldset': { borderColor: 'grey.300' },
                '&:hover fieldset': { borderColor: 'info.main' }, // Using info color for input accents
                '&.Mui-focused fieldset': { borderColor: 'info.main', borderWidth: '2px' },
              },
            }}
            InputProps={{
              sx: {
                backgroundColor: 'transparent !important',
                '& input': {
                  backgroundColor: 'transparent !important',
                  '&:-webkit-autofill': {
                    WebkitBoxShadow: '0 0 0 1000px #f0f0f0 inset !important',
                    WebkitTextFillColor: 'black !important',
                  },
                },
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{
              mt: 2,
              background: 'linear-gradient(45deg, #f093fb 30%, #f5576c 90%)', // Gradient from dashboard (pink/red)
              py: 1.5,
              borderRadius: 2.5,
              fontWeight: 'bold',
              fontSize: '1rem',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                background: 'linear-gradient(45deg, #f5576c 30%, #f093fb 90%)', // Subtle gradient change on hover
              },
            }}
          >
            SEND RESET LINK
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, pt: 2, borderTop: '1px dashed', borderColor: 'grey.300' }}>
            <MuiLink
              component="button"
              onClick={() => navigate('/login')}
              sx={{
                fontWeight: 'bold',
                textDecoration: 'none',
                color: 'primary.main', // Consistent primary color for navigation links
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Back to Login
            </MuiLink>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ForgotPassword;