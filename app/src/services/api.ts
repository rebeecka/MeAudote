import axios from 'axios';
import {API_URL} from '../lib/constants';

const api = axios.create({
  baseURL: API_URL, 
});

api.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;