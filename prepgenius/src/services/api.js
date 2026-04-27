import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (email, password, name) =>
    axiosInstance.post('/auth/register', { email, password, name }),
  
  login: (email, password) =>
    axiosInstance.post('/auth/login', { email, password }),
  
  getProfile: () =>
    axiosInstance.get('/auth/profile')
};

// Dashboard APIs
export const dashboardAPI = {
  getStats: () =>
    axiosInstance.get('/dashboard/stats'),
  
  getRecentInterviews: (limit = 5) =>
    axiosInstance.get('/dashboard/interviews', { params: { limit } }),
  
  getRecentResumes: (limit = 5) =>
    axiosInstance.get('/dashboard/resumes', { params: { limit } })
};

// Resume APIs
export const resumeAPI = {
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosInstance.post('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  getAllResumes: () =>
    axiosInstance.get('/resume'),
  
  getResumeAnalysis: (resumeId) =>
    axiosInstance.get(`/resume/${resumeId}`),
  
  deleteResume: (resumeId) =>
    axiosInstance.delete(`/resume/${resumeId}`)
};

export default axiosInstance;
