import axios from 'axios';
import storage from './storage';
import { STORAGE_KEY_TOKEN, API_URL, API_TIMEOUT } from '../constants';

const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
}); // TODO Use fetch for service workers caching.

const token = storage.get(STORAGE_KEY_TOKEN);
if (token) {
  api.defaults.headers['Authorization'] = `Bearer ${token}`;
}

export default api;
