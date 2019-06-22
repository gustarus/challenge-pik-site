import storage from './../instances/storage';
import api from './../instances/api';
import notify from './../instances/notify';
import { STORAGE_KEY_PRIMARY, STORAGE_KEY_TOKEN, URI_API_LOGIN, URI_API_REGISTER } from '../constants';
import handleApiError from '../helpers/handleApiError';

export default class Auth {

  async register(email, password) {
    try {
      const data = { email, password };
      const response = await api.post(URI_API_REGISTER, data);
      return response.data;
    } catch (e) {
      handleApiError(e);
      return false;
    }
  }

  async login(email, password) {
    try {
      const data = { email, password };
      const response = await api.post(URI_API_LOGIN, data);
      api.defaults.headers['Authorization'] = `Bearer ${response.data.token}`;
      storage.set(STORAGE_KEY_PRIMARY, response.data.id);
      storage.set(STORAGE_KEY_TOKEN, response.data.token);
      return true;
    } catch (e) {
      handleApiError(e);
      return false;
    }
  }

  async logout() {
    delete api.defaults.headers['Authorization'];
    storage.remove(STORAGE_KEY_PRIMARY);
    storage.remove(STORAGE_KEY_TOKEN);
    return true;
  }

  get primary() {
    return storage.get(STORAGE_KEY_PRIMARY);
  }

  get token() {
    return storage.get(STORAGE_KEY_TOKEN);
  }

  get logged() {
    return !!this.token;
  }
}
