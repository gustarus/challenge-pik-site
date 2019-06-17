<script>
  import uri from './../../../instances/uri';
  import { API_URL, URI_API_PICTURE } from './../../../constants';

  // TODO Bearer auth for pictures to display.

  export let data = {};
  export let pictures = [];
</script>

<style>
	h1 {
		color: purple;
	}
</style>

{#if data.id}
  <div>Id: {data.id}</div>

  {#each pictures as picture}
    <img src={API_URL}{uri.compile(URI_API_PICTURE, { id: picture.file_id })} />
  {/each}
{:else}
  Loading...
{/if}
