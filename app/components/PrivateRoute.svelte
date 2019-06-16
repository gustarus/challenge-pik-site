<script>
  import { Route, navigate } from 'svelte-routing';
  import { logged } from './../stores/logged';
  import RedirectRoute from './RedirectRoute';
  import { URI_LOGIN } from './../constants';

  export let path;
  export let component;
</script>

<Route path={path}>
  {#if $logged}
    {#if component !== null}
      <svelte:component this="{component}" />
    {:else}
      <slot></slot>
    {/if}
  {:else}
    <RedirectRoute path={URI_LOGIN} />
  {/if}
</Route>
