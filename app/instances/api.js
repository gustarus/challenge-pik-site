import axios from 'axios';
import storage from './storage';
import {STORAGE_KEY_TOKEN} from '../constants';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
});

const token = storage.get(STORAGE_KEY_TOKEN);
if (token) {
  api.defaults.headers['Authorization'] = `Bearer ${token}`;
}

export default api;
