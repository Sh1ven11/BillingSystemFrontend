import axios from 'axios';

// Create Axios instance
const API = axios.create({
  baseURL: 'https://api.mytechbuddy.in/api',
  //baseURL: 'http://localhost:3000/api',
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
  getUnpaidGrouped: (params) => axios.get('/bills/unpaid-grouped', { params }), 

  getAll: () => API.get('/bills/all'),
};

// Templates API
export const templatesAPI = {
  getAll: (params) => axios.get('/templates', { params }), // ✅ adds ?comp=1
  getOne: (id) => API.get(`/templates/${id}`),
  create: (template) => API.post('/templates/post', template),
  update: (id, template) => API.put(`/templates/${id}`, template),
  delete: (id) => API.delete(`/templates/${id}`),
  sendMail: (id) => API.post(`/templates/${id}/send-mail`)  // <--- new route
};

// Companies API (for TemplateEditor)
export const companiesAPI = {
  getAll: () => API.get('/bills/unpaid-bills-grouped'),
};

export default API;
