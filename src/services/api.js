import axios from "axios";

// ✅ Load API URL from environment (useful for production vs development)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// ✅ Create Axios Instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ Allow cookies & session (if used)
});

// ✅ Automatically attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Global Error Handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // ✅ Token expired or unauthorized
    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/"; // Redirect to home or login
    }

    // ✅ Server down or not reachable
    if (!error.response) {
      alert("⚠ Backend server is not reachable. Please start your backend.");
    }

    return Promise.reject(error);
  }
);

// ─── AUTH ENDPOINTS ───────────────────────────────────────
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
};

// ─── OTHER API MODULES (same as yours, kept unchanged) ──────────────────────
export const departmentsAPI = {
  getAll: () => api.get("/departments"),
  getById: (id) => api.get(`/departments/${id}`),
  create: (data) => api.post("/departments", data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
};

export const servicesAPI = {
  getAll: () => api.get("/services"),
  getById: (id) => api.get(`/services/${id}`),
  getByDepartment: (departmentId) =>
    api.get(`/services?department=${departmentId}`),
  create: (data) => api.post("/services", data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

export const requestsAPI = {
  getAll: (filters) => api.get("/requests", { params: filters }),
  getById: (id) => api.get(`/requests/${id}`),
  create: (data) => api.post("/requests", data),
  updateStatus: (id, data) => api.patch(`/requests/${id}/status`, data),
  delete: (id) => api.delete(`/requests/${id}`),
};

export const paymentsAPI = {
  simulate: (data) => api.post("/payments/simulate", data),
  getAll: () => api.get("/payments"),
};

export const reportsAPI = {
  getDashboard: () => api.get("/reports/dashboard"),
  getStats: () => api.get("/reports/stats"),
};

export const notificationsAPI = {
  getAll: () => api.get("/notifications"),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
};

export const usersAPI = {
  getAll: () => api.get("/users"),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post("/users", data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export default api;
