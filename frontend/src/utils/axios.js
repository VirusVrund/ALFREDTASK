import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    try {
      const auth = JSON.parse(localStorage.getItem('auth'));
      if (auth?.token) {
        config.headers.Authorization = `Bearer ${auth.token}`;
      }
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Clear auth data from localStorage
      localStorage.removeItem('auth');
      
      // Redirect to login with expired session message
      window.location.href = '/login';
      
      //could also use React Router's navigate, but window.location ensures a fresh state
      return Promise.reject({
        ...error,
        message: 'Your session has expired. Please login again.'
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;