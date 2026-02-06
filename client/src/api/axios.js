import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Add a request interceptor to add the token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const activeStore = JSON.parse(localStorage.getItem('activeStore'));

    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }

    if (activeStore) {
      // If activeStore is an object, use _id, otherwise use it directly if it's a string
      const storeId = activeStore._id || activeStore;
      config.headers['x-active-store'] = storeId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
