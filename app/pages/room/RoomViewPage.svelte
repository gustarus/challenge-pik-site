<script>
  import { Link } from 'svelte-routing';
  import uri from './../../instances/uri';
  import api from './../../instances/api';
  import RoomView from './partial/RoomView';
  import {
    URI_PROPERTY_VIEW,
    URI_API_PROPERTY,
    URI_API_PROPERTY_PICTURES_SEARCH,
    URI_API_ROOMS_SEARCH,
    URI_ROOM_VIEW,
    URI_API_ROOM,
    URI_API_ROOM_PICTURES_SEARCH,
    URI_ROOM_DELETE,
  } from './../../constants';

  // getting path params
  const params = uri.parse(window.location.pathname, URI_ROOM_VIEW); // TODO Extract this to route logic.
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

    const query = { property_room_id: data.id };
    return api.get(URI_API_ROOM_PICTURES_SEARCH, query);
  }).then((response) => {
    pictures = Object.values(response.data);
  });
</script>

<style>
	h1 {
		color: purple;
	}
</style>

<h1>Property view page</h1>
<Link to={uri.compile(URI_ROOM_DELETE, { property: propertyId, id })}>Delete</Link>

{#if data.id}
  <RoomView property={property} data={data} pictures={pictures} />
{:else}
  Loading...
{/if}
