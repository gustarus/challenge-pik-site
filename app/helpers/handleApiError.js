import auth from '../instances/auth';
import notify from '../instances/notify';
import { navigate } from 'svelte-routing';
import {HTTP_STATUS_PROTECTED, HTTP_STATUS_VALIDATION_ERROR, URI_DEFAULT} from '../constants';
import { logged } from '../stores/logged';

export default function handleApiError(e) {
  let message;
  if (e.response && e.response.status && e.response.status === HTTP_STATUS_VALIDATION_ERROR) { // validation error
    message = e.response.data[0].message;
  } else if (e.response && e.response.status && e.response.status === HTTP_STATUS_PROTECTED) { // invalid token
    message = e.response.data.message;

    // logout user on event loop end and toggle logged store
    setTimeout(() => auth.logout().then(() => logged.set(false)));
  } else if (e.response && e.response.data && e.response.data.message) { // backend error
    message = e.response.data.message;
  } else {
    message = e.message; // general exception
  }

  notify.show(message);
}
