import axios from 'axios';

export const TOKEN_KEY = 'flowops_token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (payload) => api.post('/auth/login', payload).then((r) => r.data),
  logout: () => api.post('/auth/logout').then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
};

export const incidentService = {
  list: (params = {}) => api.get('/incidents', { params }).then((r) => r.data),
  show: (id) => api.get(`/incidents/${id}`).then((r) => r.data),
  create: (payload) => api.post('/incidents', payload).then((r) => r.data),
  approve: (id, payload) => api.patch(`/incidents/${id}/approve`, payload).then((r) => r.data),
  decline: (id, payload) => api.patch(`/incidents/${id}/decline`, payload).then((r) => r.data),
  addLog: (id, payload) => api.post(`/incidents/${id}/logs`, payload).then((r) => r.data),
  resolve: (id, payload) => api.patch(`/incidents/${id}/resolve`, payload).then((r) => r.data),
};

export const dashboardService = {
  stats: () => api.get('/dashboard/stats').then((r) => r.data),
};

export const userService = {
  assignees: () => api.get('/users/assignees').then((r) => r.data),
};

export default api;