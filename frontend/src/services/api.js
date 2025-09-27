import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/fb';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (userData) => api.post('/signup', userData),
  login: (credentials) => api.post('/login', credentials),
  forgotPassword: (email) => api.post('/forgotpassword', { email }),
  resetPassword: (token, password, confirmPassword) => 
    api.post('/reset', { token, password, confirm: confirmPassword }),
};

// User API
export const userAPI = {
  getProfile: (username) => api.get(`/user/${username}`),
  updateProfile: (userData) => api.put('/editprofile', userData),
};

// Posts API
export const postsAPI = {
  getAllPosts: () => api.get('/home'),
  createPost: (postData) => api.post('/newpost', postData),
  deletePost: (postId) => api.delete(`/deletePost/${postId}`),
};

// Friends API
export const friendsAPI = {
  sendFriendRequest: (friendId) => api.post(`/sendReq/${friendId}`),
  respondToFriendRequest: (action, friendId) => api.post(`/${action}/${friendId}`),
  getFriendList: () => api.get('/friendlist'),
};

export default api;
