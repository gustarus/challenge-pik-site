import { writable } from 'svelte/store';

export const title = writable();
export const header = writable();

title.subscribe((value) => {
  header.set(value);
});

