<script>
  import api from './../../instances/api';
  import uri from './../../instances/uri';
  import { title } from './../../stores/meta';
  import Link from './../../components/Link.svelte';
  import LoadingContent from './../../components/LoadingContent.svelte';
  import {
    URI_API_ROOMS_SEARCH,
    URI_ROOM_INDEX,
    URI_ROOM_CREATE,
    URI_ROOM_VIEW,
    URI_API_PROPERTY,
    URI_PROPERTY_VIEW,
  } from './../../constants';

  $title = 'Property rooms';

  // getting path params
  const params = uri.parse(window.location.pathname, URI_ROOM_INDEX); // TODO Extract this to route logic.
  const propertyId = parseInt(params.property, 10);

  // loading elements
  let property = {};
  let data = [];
  let loading = true;
  api.get(uri.compile(URI_API_PROPERTY, { id: propertyId })).then((response) => {
    property = response.data;

    $title = `Property "${property.title}" rooms`;

    const params = { property_id: property.id };
    return api.get(URI_API_ROOMS_SEARCH, { params })
  }).then((response) => {
    data = [...Object.values(response.data)];
    loading = false;
  });
</script>

<style>
  .content {
    margin-top: 1rem;
  }
</style>

<Link to={uri.compile(URI_PROPERTY_VIEW, { id: propertyId })} class="btn btn-secondary btn-block">Go to the property</Link>
<Link to={uri.compile(URI_ROOM_CREATE, { property: propertyId })} class="btn btn-success btn-block">Add room to the property</Link>

<div class="content">
  <LoadingContent loading={loading}>
    {#if data.length}
      <div class="list-group">
        {#each data as item}
          <Link to={uri.compile(URI_ROOM_VIEW, { property: propertyId, id: item.id })} class="list-group-item list-group-item-action">
            {item.title}
          </Link>
        {/each}
      </div>
    {:else}
      <span class="text-muted">Empty list received</span>
    {/if}
  </LoadingContent>
</div>
