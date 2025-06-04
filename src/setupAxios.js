// src/setupAxios.js
import axios from 'axios';

export function setupAxiosInterceptors() {
  const token = localStorage.getItem('token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}
