import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Add a request interceptor to add the token
api.interceptors.request.use(
  (config) => {
    let user = null;
    let activeStore = null;

    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) user = JSON.parse(storedUser);
      
      const storedActiveStore = localStorage.getItem('activeStore');
      if (storedActiveStore) activeStore = JSON.parse(storedActiveStore);
    } catch (e) {
      console.error('Error parsing localStorage:', e);
      localStorage.removeItem('user');
      localStorage.removeItem('activeStore');
    }

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
