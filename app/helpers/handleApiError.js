import notify from '../instances/notify';

export default function handleApiError(e) {
  let message = e.response && e.response.status && e.response.status === HTTP_STATUS_VALIDATION_ERROR
    ? e.response.data[0].message : e.message;
  notify.show(message);
}
