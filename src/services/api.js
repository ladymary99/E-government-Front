import axios from "axios";

// ✅ Load API URL from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// ✅ Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // if backend uses cookies/session
});

// ✅ Attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) alert("⚠ Backend server not reachable.");
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// ─── AUTH API ─────────────────────────────────
export const authAPI = {
  register: async (data) => {
    try {
      const response = await api.post("/auth/register", data);
      return {
        success: true,
        data: response.data,
        message: response.data.message || "Registration successful",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to register. Please check your input.",
      };
    }
  },

  login: async (data) => {
    try {
      const response = await api.post("/auth/login", data);
      return {
        success: true,
        data: response.data,
        message: response.data.message || "Login successful",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Login failed. Please check your credentials.",
      };
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get("/auth/profile");
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch profile" };
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await api.put("/auth/profile", data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to update profile" };
    }
  },
};

export default api;
