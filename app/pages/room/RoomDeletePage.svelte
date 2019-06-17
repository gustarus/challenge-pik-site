<script>
  import api from './../../instances/api';
  import uri from './../../instances/uri';
  import { navigate } from 'svelte-routing';
  import {
    URI_PROPERTY_DELETE,
    URI_PROPERTY_INDEX,
    URI_API_PROPERTY,
    URI_ROOM_DELETE,
    URI_API_ROOM,
    URI_ROOM_INDEX,
  } from './../../constants';

  // getting path params
  const params = uri.parse(window.location.pathname, URI_ROOM_DELETE); // TODO Extract this to route logic.
  const propertyId = parseInt(params.property, 10);
  const id = parseInt(params.id, 10);

  // loading elements
  $: property = {};
  $: data = {};
  $: pictures = [];
  api.get(uri.compile(URI_API_PROPERTY, { id: propertyId })).then((response) => {
    property = response.data;
    return api.get(uri.compile(URI_API_ROOM, { id }));
  }).then((response) => {
    data = response.data;
    if (data.property_id !== propertyId) {
      throw new Error('Invalid property id key passed to path string.');
    }

    // deleting element
    return api.delete(uri.compile(URI_API_ROOM, { id }));
  }).then(() => {
    navigate(uri.compile(URI_ROOM_INDEX, { property: propertyId }));
  });
</script>

<style>
	h1 {
		color: purple;
	}
</style>

<h1>Property delete page</h1>
