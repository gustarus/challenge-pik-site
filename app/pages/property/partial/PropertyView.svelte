<script>
  import { Link } from 'svelte-routing';
  import uri from './../../../instances/uri';
  import { API_URL, URI_API_PICTURE, URI_PROPERTY_UPDATE } from './../../../constants';

  // TODO Bearer auth for pictures to display.

  export let data = {};
  export let pictures = [];
</script>

<style>
	h1 {
		color: purple;
	}
</style>

<div>
  Id: {data.id}
  <Link to={uri.compile(URI_PROPERTY_UPDATE, { id: data.id })}>Update</Link>
</div>

{#each pictures as picture}
  <img src={API_URL}{uri.compile(URI_API_PICTURE, { id: picture.file_id })} />
{/each}
