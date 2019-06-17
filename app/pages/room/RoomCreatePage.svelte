<script>
  import api from './../../instances/api';
  import uri from './../../instances/uri';
  import RoomForm from './partial/RoomForm';
  import { URI_ROOM_INDEX, URI_API_PROPERTY } from './../../constants';

  // getting path params
  const params = uri.parse(window.location.pathname, URI_ROOM_INDEX); // TODO Extract this to route logic.
  const propertyId = parseInt(params.property, 10);

  // loading elements
  $: property = {};
  api.get(uri.compile(URI_API_PROPERTY, { id: propertyId })).then((response) => {
    property = response.data;
  });
</script>

<style>
	h1 {
		color: purple;
	}
</style>

<h1>Property create page</h1>
{#if property.id}
  <div>Property id: {property.id}</div>
  <RoomForm property={property} />
{:else}
  Loading...
{/if}
