<script>
  import { Link } from 'svelte-routing';
  import uri from './../../../instances/uri';
  import { API_URL, URI_ROOM_UPDATE, URI_API_PICTURE } from './../../../constants';

  // TODO Bearer auth for pictures to display.

  export let property = {};
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
  <Link to={uri.compile(URI_ROOM_UPDATE, { property: property.id, id: data.id })}>Update</Link>
</div>

{#each pictures as picture}
  <img src={API_URL}{uri.compile(URI_API_PICTURE, { id: picture.file_id })} />
{/each}
