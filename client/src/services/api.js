import axios from 'axios';

const API = axios.create({
  baseURL: 'https://my-hospital-odec.vercel.app/api', // Backend URL
});

// Security: Token automatically har request ke saath jayega
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const loginUser = (formData) => API.post('/auth/login', formData);
export const registerUser = (formData) => API.post('/auth/register', formData);
export const fetchPatients = () => API.get('/patients');

export default API;