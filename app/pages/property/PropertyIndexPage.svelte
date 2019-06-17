<script>
  import api from './../../instances/api';
  import uri from './../../instances/uri';
  import { Link } from 'svelte-routing';
  import { URI_API_PROPERTIES, URI_PROPERTY_CREATE, URI_PROPERTY_VIEW } from './../../constants';

  // loading elements
  $: data = [];
  api.get(URI_API_PROPERTIES).then((response) => {
    data = [...response.data];
  });
</script>

<style>
	h1 {
		color: purple;
	}
</style>

<h1>Properties page</h1>
<Link to={URI_PROPERTY_CREATE}>Create</Link>

<ul>
	{#each data as item}
		<li>
		  <a href={uri.compile(URI_PROPERTY_VIEW, {id: item.id})}>
		    {item.title}, {item.address}
      </a>
    </li>
	{/each}
</ul>
