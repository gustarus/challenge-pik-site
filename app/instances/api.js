import axios from 'axios';
import storage from './storage';
import { STORAGE_KEY_TOKEN, API_URL, API_TIMEOUT } from '../constants';
import convertDataUriToBlob from '../helpers/convertDataUriToBlob';

const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
}); // TODO Use fetch for service workers caching.

const token = storage.get(STORAGE_KEY_TOKEN);
if (token) {
  api.defaults.headers['Authorization'] = `Bearer ${token}`;
}

/**
 * Upload dataURI file to the server.
 * @param uri
 * @param dataURI
 */
api.upload = (uri, dataURI) =>{
  if(typeof dataURI !=='string') {
    throw new Error('Invalid data passed to upload. Should be string');
  }

  // convert dataURI to blob
  const blob = convertDataUriToBlob(dataURI);

  // upload the file
  const data = new FormData();
  data.append('file', blob);
  return api.post(uri, data);
};

export default api;
