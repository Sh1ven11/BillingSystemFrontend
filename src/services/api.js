import axios from 'axios';

// Create Axios instance
const API = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true // important to send session cookie
});

// Auth API
export const authAPI = {
  login: (credentials) => API.post('/auth/sign-in', credentials),
  logout: () => API.post('/auth/sign-out'),
  checkAuth: () => API.get('/auth/check'),
};

// Bills API
export const billsAPI = {
  getUnpaidGrouped: () => API.get('/bills/unpaid-bills-grouped'),
  getAll: () => API.get('/bills/all'),
};

// Templates API
export const templatesAPI = {
  getAll: () => API.get('/templates'),
  getOne: (id) => API.get(`/templates/${id}`),
  create: (template) => API.post('/templates/post', template),
  update: (id, template) => API.put(`/templates/${id}`, template),
  delete: (id) => API.delete(`/templates/${id}`),
};

// Companies API (for TemplateEditor)
export const companiesAPI = {
  getAll: () => API.get('/bills/unpaid-bills-grouped'),
};

export default API;
