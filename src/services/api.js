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

// Handle token refresh - CHỈ XỬ LÝ REFRESH TOKEN, KHÔNG REDIRECT
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // CHỈ XỬ LÝ REFRESH TOKEN CHO ADMIN KHI CÓ REFRESH TOKEN
    if (error.response && 
        error.response.status === 401 && 
        !originalRequest._retry &&
        originalRequest.url.startsWith('/admin')) {
      
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
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
          // Chỉ xóa token, KHÔNG redirect
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          return Promise.reject(refreshError);
        }
      }
    }
    
    // LUÔN REJECT ERROR ĐỂ COMPONENT XỬ LÝ
    return Promise.reject(error);
  }
);

export default api;