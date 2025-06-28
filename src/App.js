import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import "react-toastify/dist/ReactToastify.css";

// Import Theme Context và Themes
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { lightTheme, darkTheme } from './theme/theme';

// Import Pages
import AdminLoginPage from "./pages/AdminLoginPage";
import UserRegisterPage from "./pages/UserRegisterPage";
import UserLoginPage from "./pages/UserLoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import UserProfilePage from "./pages/UserProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import UserManagementPage from "./pages/UserManagementPage";
import CategoryManagementPage from "./pages/CategoryManagementPage";
import CourseManagementPage from "./pages/CourseManagementPage";
import CourseContentPage from "./pages/CourseContentPage";
import CourseListStudent from "./components/CourseListStudent";
import ContentListStudent from "./components/ContentListStudent";
import ProtectedRoute from "./components/ProtectedRoute";

const AppContent = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <MuiThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <ToastContainer 
          position="top-right" 
          autoClose={3000}
          theme={isDarkMode ? 'dark' : 'light'}
          toastStyle={{
            backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
            color: isDarkMode ? '#f7fafc' : '#2d3748',
          }}
        />
        <Routes>
          {/* Các route không yêu cầu đăng nhập */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/register" element={<UserRegisterPage />} />
          <Route path="/login" element={<UserLoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/" element={<CourseListStudent />} />
          <Route path="/courses" element={<CourseListStudent />} />
          <Route path="/courses/:courseId/content" element={<ContentListStudent />} />

          {/* Các route yêu cầu đăng nhập */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePasswordPage />
              </ProtectedRoute>
            }
          />

          {/* Các route admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <UserManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute>
                <CategoryManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute>
                <CourseManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses/:courseId/content"
            element={
              <ProtectedRoute>
                <CourseContentPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </MuiThemeProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;