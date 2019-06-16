<script>
  import { Route, navigate } from 'svelte-routing';
  import { logged } from './../stores/logged';
  import RedirectRoute from './RedirectRoute';
  import { URI_DEFAULT } from './../constants';

  export let path;
  export let component;
</script>

<Route path={path}>
  {#if $logged}
    <RedirectRoute path={URI_DEFAULT} />
  {:else}
    {#if component !== null}
      <svelte:component this="{component}" />
    {:else}
      <slot></slot>
    {/if}
  {/if}
</Route>
