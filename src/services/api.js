const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('access_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        localStorage.removeItem('access_token');
        window.location.href = '/';
        throw new Error('Unauthorized');
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  auth: {
    async register(email, password, fullName) {
      return api.request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
        }),
      });
    },

    async login(email, password) {
      const response = await api.request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('access_token', response.access_token);
      return response;
    },

    logout() {
      localStorage.removeItem('access_token');
    },

    isAuthenticated() {
      return !!localStorage.getItem('access_token');
    },
  },

  users: {
    async getProfile() {
      return api.request('/api/users/profile');
    },

    async updateProfile(data) {
      return api.request('/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
  },

  uploads: {
    async uploadFile(file) {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/api/uploads/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Upload failed');
      }

      return response.json();
    },
  },

  results: {
    async process(data) {
      return api.request('/api/results/process', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async getAll() {
      return api.request('/api/results/');
    },

    async getById(id) {
      return api.request(`/api/results/${id}`);
    },
  },
};








// --- IGNORE ---
// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Menu, X, Home, LayoutDashboard, Upload, BarChart3, Settings, ChevronRight, Check, AlertCircle, Download, LogOut, User } from 'lucide-react';

// // API Configuration
// const API_BASE_URL = 'http://localhost:8000';

// // API Service
// const api = {
//   async request(endpoint, options = {}) {
//     const token = localStorage.getItem('access_token');
//     const headers = {
//       'Content-Type': 'application/json',
//       ...(token && { Authorization: `Bearer ${token}` }),
//       ...options.headers,
//     };

//     try {
//       const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//         ...options,
//         headers,
//       });

//       if (response.status === 401) {
//         localStorage.removeItem('access_token');
//         window.location.href = '/';
//         throw new Error('Unauthorized');
//       }

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.detail || 'Request failed');
//       }

//       return data;
//     } catch (error) {
//       console.error('API Error:', error);
//       throw error;
//     }
//   },

//   auth: {
//     async register(email, password, fullName) {
//       return api.request('/api/auth/register', {
//         method: 'POST',
//         body: JSON.stringify({
//           email,
//           password,
//           full_name: fullName,
//         }),
//       });
//     },

//     async login(email, password) {
//       const response = await api.request('/api/auth/login', {
//         method: 'POST',
//         body: JSON.stringify({ email, password }),
//       });
//       localStorage.setItem('access_token', response.access_token);
//       return response;
//     },

//     logout() {
//       localStorage.removeItem('access_token');
//     },

//     isAuthenticated() {
//       return !!localStorage.getItem('access_token');
//     },
//   },

//   users: {
//     async getProfile() {
//       return api.request('/api/users/profile');
//     },

//     async updateProfile(data) {
//       return api.request('/api/users/profile', {
//         method: 'PUT',
//         body: JSON.stringify(data),
//       });
//     },
//   },

//   uploads: {
//     async uploadFile(file) {
//       const formData = new FormData();
//       formData.append('file', file);

//       const token = localStorage.getItem('access_token');
//       const response = await fetch(`${API_BASE_URL}/api/uploads/`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.detail || 'Upload failed');
//       }

//       return response.json();
//     },
//   },

//   results: {
//     async process(data) {
//       return api.request('/api/results/process', {
//         method: 'POST',
//         body: JSON.stringify(data),
//       });
//     },

//     async getAll() {
//       return api.request('/api/results/');
//     },

//     async getById(id) {
//       return api.request(`/api/results/${id}`);
//     },
//   },
// };