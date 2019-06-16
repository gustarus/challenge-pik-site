import {STORAGE_KEY} from '../constants';

export default class Storage {
  set(property, value) {
    localStorage.setItem(`${STORAGE_KEY}/${property}`, value);
  }

  get(property) {
    return localStorage.getItem(`${STORAGE_KEY}/${property}`)
      || undefined;
  }

  remove(property) {
    localStorage.removeItem(`${STORAGE_KEY}/${property}`);
  }
}
