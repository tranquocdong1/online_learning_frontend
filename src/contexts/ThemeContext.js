import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider, alpha } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const muiTheme = useMemo(() => {
    const tempTheme = createTheme({
      palette: {
        mode: isDarkMode ? 'dark' : 'light',
        background: {
          default: isDarkMode ? '#121212' : '#F4F6F8',
          paper: isDarkMode ? '#1A2027' : '#FFFFFF',
        },
        primary: {
          main: '#667eea',
        },
        secondary: {
          main: '#f093fb',
        },
        text: {
          primary: isDarkMode ? '#FFFFFF' : '#212121',
          secondary: isDarkMode ? '#B0B3B8' : '#757575',
          disabled: isDarkMode ? '#A0A0A0' : '#B0B0B0',
        },
      },
    });

    return createTheme(tempTheme, {
      components: {
        MuiMenuItem: {
          styleOverrides: {
            root: {
              '&.Mui-selected': {
                backgroundColor: isDarkMode ? alpha(tempTheme.palette.primary.main, 0.2) : alpha(tempTheme.palette.primary.main, 0.1),
                color: isDarkMode ? '#FFFFFF' : '#212121',
              },
              '&:hover': {
                backgroundColor: isDarkMode ? alpha(tempTheme.palette.primary.main, 0.1) : alpha(tempTheme.palette.primary.main, 0.05),
                color: isDarkMode ? '#FFFFFF' : '#212121',
              },
            },
          },
        },
      },
    });
  }, [isDarkMode]);

  const contextValue = {
    isDarkMode,
    toggleTheme,
    theme: isDarkMode ? 'dark' : 'light',
  };

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <ThemeContext.Provider value={contextValue}>
        {children}
      </ThemeContext.Provider>
    </MuiThemeProvider>
  );
};