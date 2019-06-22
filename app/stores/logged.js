import { writable } from 'svelte/store';
import storage from '../instances/storage';
import { STORAGE_KEY_TOKEN } from '../constants';

const success = !!storage.get(STORAGE_KEY_TOKEN);
export const logged = writable(success);

