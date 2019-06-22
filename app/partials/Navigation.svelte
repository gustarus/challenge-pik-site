<script>
  import { Link } from 'svelte-routing';
  import { logged } from './../stores/logged';
  import {
    URI_DEFAULT,
    URI_REGISTER,
    URI_LOGIN,
    URI_LOGOUT,
    URI_PROPERTY_INDEX,
  } from './../constants';

  function getLinkProps({ href, isCurrent, isPartiallyCurrent }) {
    let active;
    if (href === URI_DEFAULT) {
      active = isCurrent;
    } else if (href.indexOf(URI_REGISTER) === 0) {
      active = isPartiallyCurrent;
    } else if (href.indexOf(URI_LOGIN) === 0) {
      active = isPartiallyCurrent;
    } else if (href.indexOf(URI_PROPERTY_INDEX) === 0) {
      active = isPartiallyCurrent;
    }

    return { class: `nav-link ${active && 'active'}` };
  }
</script>

<style>
  .component {
    margin-bottom: 1rem;
  }

  .brand {
    border-radius: 2px;
  }
</style>

<nav class="component navbar navbar-expand-lg navbar-light bg-light">
  <span class="navbar-brand">
    <img src="/brand-192.png" width="30" height="30" alt="" class="brand">
  </span>

  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <Link to={URI_DEFAULT} getProps={getLinkProps}>
          Home
        </Link>
      </li>

      {#if $logged}
        <li class="nav-item">
          <Link to={URI_PROPERTY_INDEX} getProps={getLinkProps}>Properties</Link>
        </li>
        <li class="nav-item">
          <Link to={URI_LOGOUT} getProps={getLinkProps}>Sign out</Link>
        </li>
      {:else}
        <li class="nav-item">
          <Link to={URI_LOGIN} getProps={getLinkProps}>Sign in</Link>
        </li>
        <li class="nav-item">
          <Link to={URI_REGISTER} getProps={getLinkProps}>Sign up</Link>
        </li>
      {/if}
    </ul>
  </div>
</nav>
