<script>
  import { Link } from 'svelte-routing';
  import uri from './../../instances/uri';
  import api from './../../instances/api';
  import PropertyView from './partial/PropertyView';
  import { URI_PROPERTY_VIEW, URI_API_PROPERTY, URI_API_PROPERTY_PICTURES_SEARCH, URI_ROOM_INDEX } from './../../constants';

  // getting path params
  const params = uri.parse(window.location.pathname, URI_PROPERTY_VIEW); // TODO Extract this to route logic.
  const id = parseInt(params.id, 10);

  // loading element
  $: data = {};
  $: pictures = [];
  const uriToPropertyApi = uri.compile(URI_API_PROPERTY, { id });
  api.get(uriToPropertyApi).then((response) => {
    data = response.data;

    const query = { property_id: data.id };
    return api.get(URI_API_PROPERTY_PICTURES_SEARCH, query);
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
<Link to={uri.compile(URI_ROOM_INDEX, { property: id })}>Rooms</Link>

{#if data.id}
  <PropertyView data={data} pictures={pictures} />
{:else}
  Loading...
{/if}
