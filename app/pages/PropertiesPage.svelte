<script>
import api from './../instances/api';
  import { URI_API_PROPERTIES } from './../constants';

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

<ul>
	{#each data as item}
		<li>{item.title}, {item.address}</li>
	{/each}
</ul>
