<script>
  export let loading = false;
</script>

{#if loading}
  <div class="d-flex justify-content-center">
    <div class="spinner-border" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
{:else}
  <slot></slot>
{/if}
