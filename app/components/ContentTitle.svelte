<script>
  import { title } from './../stores/meta';
</script>

{#if $title}
  <h3>{$title}</h3>
  <hr />
{/if}
