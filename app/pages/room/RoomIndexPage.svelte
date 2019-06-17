<script>
  import api from './../../instances/api';
  import uri from './../../instances/uri';
  import { Link } from 'svelte-routing';
  import {
    URI_API_ROOMS_SEARCH,
    URI_ROOM_INDEX,
    URI_ROOM_CREATE,
    URI_ROOM_VIEW,
    URI_API_PROPERTY,
  } from './../../constants';

  // getting path params
  const params = uri.parse(window.location.pathname, URI_ROOM_INDEX); // TODO Extract this to route logic.
  const propertyId = parseInt(params.property, 10);

  // loading elements
  $: property = {};
  $: data = [];
  api.get(uri.compile(URI_API_PROPERTY, { id: propertyId })).then((response) => {
    property = response.data;
    const query = { property_id: property.id };
    return api.get(URI_API_ROOMS_SEARCH, query)
  }).then((response) => {
    data = [...response.data];
  });
</script>

<style>
	h1 {
		color: purple;
	}
</style>

<h1>Rooms page</h1>
{#if property.id}
  <div>
    Id: #{property.id}
    <Link to={uri.compile(URI_ROOM_CREATE, { property: propertyId })}>Create room</Link>
  </div>

  <ul>
    {#each data as item}
      <li>
        <a href={uri.compile(URI_ROOM_VIEW, { property: propertyId, id: item.id })}>
          {item.title}, {item.address}
        </a>
      </li>
    {/each}
  </ul>
{:else}
  Loading...
{/if}
