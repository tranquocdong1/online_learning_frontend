import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const path = config.url;

  if (path.startsWith('/admin')) {
    // Admin routes
    const adminAccessToken = localStorage.getItem('adminAccessToken');
    if (adminAccessToken) {
      config.headers.Authorization = `Bearer ${adminAccessToken}`;
    }
  } else {
    // User routes
    const userAccessToken = localStorage.getItem('userAccessToken');
    if (userAccessToken) {
      config.headers.Authorization = `Bearer ${userAccessToken}`;
    }
  }

  return config;
});

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (originalRequest.url.startsWith('/admin')) {
        // Admin routes
        const refreshToken = localStorage.getItem('adminRefreshToken');
        if (refreshToken) {
          try {
            const response = await axios.post(
              `${process.env.REACT_APP_API_URL}/admin/refresh-token`,
              { refreshToken }
            );
            const { accessToken } = response.data;
            localStorage.setItem('adminAccessToken', accessToken);
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            localStorage.removeItem('adminAccessToken');
            localStorage.removeItem('adminRefreshToken');
            window.location.href = '/admin/login';
            return Promise.reject(refreshError);
          }
        } else {
          window.location.href = '/admin/login';
          return Promise.reject(error);
        }
      } else {
        // User routes
        localStorage.removeItem('userAccessToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;