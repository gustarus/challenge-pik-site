<script>
  export let data = {};
</script>

<style>
	h1 {
		color: purple;
	}
</style>

{#if data.id}
  <div>Id: {data.id}</div>
{:else}
  Loading...
{/if}
