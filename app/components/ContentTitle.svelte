<script>
  import { header, title } from './../stores/meta';
</script>

{#if $header || $title}
  <h3>{$header || $title}</h3>
  <hr />
{/if}
