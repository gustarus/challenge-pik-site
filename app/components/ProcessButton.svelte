<script>
  export let loading = false;
  export let placeholder = 'Processing...';
  export let className = 'btn-primary btn-block';
</script>


<button type="submit" class="btn {className}" disabled={loading}>
  {#if loading}
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    {placeholder}
  {:else}
    <slot></slot>
  {/if}
</button>
