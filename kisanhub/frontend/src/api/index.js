import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('kh_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  res => res,
  err => {
    const isLoginPage = window.location.pathname === '/login';
    if (err.response?.status === 401 && !isLoginPage) {
      localStorage.removeItem('kh_token');
      localStorage.removeItem('kh_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────
export const authAPI = {
  register: (data)          => api.post('/auth/register', data),
  login:    (data)          => api.post('/auth/login', data),
  me:       ()              => api.get('/auth/me'),
  updateProfile: (data)     => api.put('/auth/profile', data),
  changePassword: (data)    => api.put('/auth/password', data),
};

// ── Products ──────────────────────────────────────────────
export const productsAPI = {
  getAll:   (params)        => api.get('/products', { params }),
  getOne:   (id)            => api.get(`/products/${id}`),
  create:   (data)          => api.post('/products', data),
  update:   (id, data)      => api.put(`/products/${id}`, data),
  remove:   (id)            => api.delete(`/products/${id}`),
};

// ── Cart ──────────────────────────────────────────────────
export const cartAPI = {
  get:      ()              => api.get('/cart'),
  add:      (productId, quantity = 1) => api.post('/cart/add', { productId, quantity }),
  update:   (productId, quantity)     => api.put('/cart/update', { productId, quantity }),
  remove:   (productId)               => api.delete(`/cart/remove/${productId}`),
  clear:    ()              => api.delete('/cart/clear'),
};

// ── Orders ────────────────────────────────────────────────
export const ordersAPI = {
  checkout: (data)          => api.post('/orders/checkout', data),
  myOrders: ()              => api.get('/orders/my'),
  getOne:   (id)            => api.get(`/orders/${id}`),
  getAll:   (params)        => api.get('/orders', { params }),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

// ── Advisory ──────────────────────────────────────────────
export const advisoryAPI = {
  getAll:   (params)        => api.get('/advisory', { params }),
  create:   (data)          => api.post('/advisory', data),
  update:   (id, data)      => api.put(`/advisory/${id}`, data),
  remove:   (id)            => api.delete(`/advisory/${id}`),
};

// ── Schemes ───────────────────────────────────────────────
export const schemesAPI = {
  getAll:   ()              => api.get('/schemes'),
  create:   (data)          => api.post('/schemes', data),
  update:   (id, data)      => api.put(`/schemes/${id}`, data),
  remove:   (id)            => api.delete(`/schemes/${id}`),
  apply:    (id)            => api.post(`/schemes/${id}/apply`),
  getApps:  ()              => api.get('/schemes/applications/all'),
  updateApp:(id, data)      => api.put(`/schemes/applications/${id}`, data),
};

// ── Mandi Prices ──────────────────────────────────────────
export const pricesAPI = {
  getAll:   (params)        => api.get('/prices', { params }),
  create:   (data)          => api.post('/prices', data),
  update:   (id, data)      => api.put(`/prices/${id}`, data),
  remove:   (id)            => api.delete(`/prices/${id}`),
};

// ── Weather ───────────────────────────────────────────────
export const weatherAPI = {
  get:      (city)          => api.get('/weather', { params: { city } }),
};

// ── Admin ─────────────────────────────────────────────────
export const adminAPI = {
  getStats:   ()            => api.get('/admin/stats'),
  getFarmers: (params)      => api.get('/admin/farmers', { params }),
  updateFarmer:(id, data)   => api.put(`/admin/farmers/${id}`, data),
  deleteFarmer:(id)         => api.delete(`/admin/farmers/${id}`),
};

export default api;
