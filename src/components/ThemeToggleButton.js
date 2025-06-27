import React from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggleButton = ({ variant = 'icon' }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  if (variant === 'floating') {
    return (
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <Tooltip title={isDarkMode ? 'Chuyển sang Light Mode' : 'Chuyển sang Dark Mode'}>
          <IconButton
            onClick={toggleTheme}
            sx={{
              width: 56,
              height: 56,
              background: isDarkMode 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 35px rgba(0,0,0,0.2)',
                background: isDarkMode 
                  ? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                  : 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
              }
            }}
          >
            {isDarkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Tooltip>
      </Box>
    );
  }

  return (
    <Tooltip title={isDarkMode ? 'Chuyển sang Light Mode' : 'Chuyển sang Dark Mode'}>
      <IconButton
        onClick={toggleTheme}
        sx={{
          background: isDarkMode 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white',
          width: 48,
          height: 48,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
          }
        }}
      >
        {isDarkMode ? <LightMode /> : <DarkMode />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggleButton;