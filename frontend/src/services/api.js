import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
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

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

export const ticketService = {
  create: (ticketData) => api.post('/tickets', ticketData),
  getAll: (params) => api.get('/tickets', { params }),
  getById: (id) => api.get(`/tickets/${id}`),
  update: (id, data) => api.put(`/tickets/${id}`, data),
  addMessage: (id, message) => api.post(`/tickets/${id}/messages`, { message }),
  getStats: () => api.get('/tickets/stats'),
};

export const chatService = {
  sendMessage: (message) => api.post('/chat/message', { message }),
  getHistory: (params) => api.get('/chat/history', { params }),
  clearHistory: () => api.delete('/chat/history'),
  getFAQs: () => api.get('/chat/faqs'),
  createFAQ: (faqData) => api.post('/chat/faqs', faqData),
  updateFAQ: (id, faqData) => api.put(`/chat/faqs/${id}`, faqData),
  deleteFAQ: (id) => api.delete(`/chat/faqs/${id}`),
};

export const userService = {
  getAgents: () => api.get('/users/agents'),
  getAllUsers: () => api.get('/users'),
  updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
};

export default api;
