import storage from './../instances/storage';
import api from './../instances/api';
import {STORAGE_KEY_TOKEN, URI_API_LOGIN} from '../constants';

export default class Auth {

  async login(username, password) {
    try {
      const data = {username, password};
      const response = await api.post(URI_API_LOGIN, data);
      api.defaults.headers['Authorization'] = `Bearer: ${response.data}`;
      storage.set(STORAGE_KEY_TOKEN, response.data);
      return true;
    } catch (e) {
      // TODO Process catch block.
      alert(e.message);
      return false;
    }
  }

  async logout() {
    delete api.defaults.headers['Authorization'];
    storage.remove(STORAGE_KEY_TOKEN);
    return true;
  }

  get token() {
    return storage.get(STORAGE_KEY_TOKEN);
  }

  get logged() {
    return !!this.token;
  }
}
