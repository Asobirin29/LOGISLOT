import axios from 'axios';

// In-memory token storage
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

const TOKEN_STORAGE_KEY = 'logislot_token';
const USER_STORAGE_KEY = 'logislot_user';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Important for reading/setting httpOnly cookies
});

api.interceptors.request.use(
  (config) => {
    // Use in-memory token, or fall back to localStorage
    const token = accessToken || (typeof window !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      if (!accessToken) setAccessToken(token); // sync back to memory
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh loop for auth endpoints
    const isAuthEndpoint = originalRequest.url?.includes('/auth/');

    // If 401 and not already retrying, and it's not an auth endpoint
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh the token using httpOnly cookie
        const res = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        
        const newToken = res.data.data.token;
        setAccessToken(newToken);
        if (typeof window !== 'undefined') {
          localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
        }
        
        // Update header and retry request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed — clear session and redirect to login
        setAccessToken(null);
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          localStorage.removeItem(USER_STORAGE_KEY);
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
