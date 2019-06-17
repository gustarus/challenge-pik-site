<script>
  import { Link } from 'svelte-routing';
  import {
    URI_DEFAULT,
    URI_REGISTER,
    URI_LOGIN,
    URI_LOGOUT,
  } from './../constants';
</script>

<nav>
  <Link to={URI_DEFAULT}>Default</Link>
  <Link to={URI_REGISTER}>Register</Link>
  <Link to={URI_LOGIN}>Login</Link>
  <Link to={URI_LOGOUT}>Logout</Link>
</nav>
