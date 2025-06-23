import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  // Kiểm tra loại token phù hợp với route
  const path = config.url;
  
  if (path.startsWith('/admin')) {
    // Admin routes - dùng accessToken
    const adminToken = localStorage.getItem('accessToken');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
  } else {
    // User routes - dùng token
    const userToken = localStorage.getItem('token');
    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }
  }
  
  return config;
});

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Kiểm tra xem có refresh token không (chỉ admin mới có)
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        // Đây là admin, thử refresh token
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/admin/refresh-token`,
            { refreshToken }
          );
          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh thất bại, xóa token và redirect
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/admin/login';
          return Promise.reject(refreshError);
        }
      } else {
        // Đây là user, xóa token và redirect
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;