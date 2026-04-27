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
    axiosInstance.get('/auth/profile'),

  updateName: (name) =>
    axiosInstance.put('/auth/profile/name', { name }),

  updatePassword: (currentPassword, newPassword) =>
    axiosInstance.put('/auth/profile/password', { currentPassword, newPassword })
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
  uploadResume: (file, jdHints = '') => {
    const formData = new FormData();
    formData.append('file', file);
    if (jdHints) {
      formData.append('jdHints', jdHints);
    }
    return axiosInstance.post('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  analyzeText: (resumeText, jdHints = '') =>
    axiosInstance.post('/resume/analyze-text', { resumeText, jdHints }),

  getTemplates: () =>
    axiosInstance.get('/resume/templates'),
  
  getAllResumes: () =>
    axiosInstance.get('/resume'),
  
  getResumeAnalysis: (resumeId) =>
    axiosInstance.get(`/resume/${resumeId}`),
  
  deleteResume: (resumeId) =>
    axiosInstance.delete(`/resume/${resumeId}`)
};

// Interview APIs
export const interviewAPI = {
  startInterview: (role, difficulty) =>
    axiosInstance.post('/interview/start', { role, difficulty }).then(res => res.data),
  
  getInterviewQuestions: (interviewId) =>
    axiosInstance.get(`/interview/${interviewId}`).then(res => res.data),
  
  submitAnswer: (questionId, userAnswer, meta = {}) =>
    axiosInstance.post('/interview/answer', {
      questionId,
      userAnswer,
      ...meta
    }).then(res => res.data),
  
  getInterviewResults: (interviewId) =>
    axiosInstance.get(`/interview/${interviewId}/results`).then(res => res.data),
  
  getUserInterviews: (limit = 10) =>
    axiosInstance.get('/interview', { params: { limit } }).then(res => res.data)
};

export default axiosInstance;
