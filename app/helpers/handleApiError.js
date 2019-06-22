import notify from '../instances/notify';

export default function handleApiError(e) {
  let message;
  if (e.response && e.response.data && e.response.data.message) {
    message = e.response.data.message;
  } else if (e.response && e.response.status && e.response.status === HTTP_STATUS_VALIDATION_ERROR) {
    message = e.response.data[0].message;
  } else {
    message = e.message;
  }

  notify.show(message);
}
