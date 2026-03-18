import axios from 'axios';

// Configure global axios defaults so even legacy imports use the same base/timeout/interceptors
export const configureAxios = () => {
  const baseURL =
    import.meta.env.VITE_API_BASE ||
    import.meta.env.VITE_API_BASE_URL ||
    'https://my-hospital-odec.vercel.app/api';

  axios.defaults.baseURL = baseURL;
  axios.defaults.timeout = 7000;
  axios.defaults.headers.common['Content-Type'] = 'application/json';

  // Attach token if present
  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // Basic retry once on network failure
  axios.interceptors.response.use(
    (res) => res,
    async (error) => {
      const config = error.config || {};
      if (!config.__retry && !error.response) {
        config.__retry = true;
        return axios(config);
      }
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

export default configureAxios;
