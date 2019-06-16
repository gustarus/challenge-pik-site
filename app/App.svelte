<script>
  import { Router, Link, Route } from 'svelte-routing';
  import PrivateRoute from './components/PrivateRoute';
  import PublicRoute from './components/PublicRoute';
  import DefaultPage from './pages/DefaultPage';
  import RegisterPage from './pages/RegisterPage';
  import LoginPage from './pages/LoginPage';
  import LogoutPage from './pages/LogoutPage';
  import RecoveryPage from './pages/RecoveryPage';
  import {URI_DEFAULT, URI_REGISTER, URI_LOGIN, URI_LOGOUT, URI_RECOVERY} from './constants';

  export let url = '';
</script>

<Router url="{url}">
  <nav>
    <Link to="{URI_DEFAULT}">Default</Link>
    <Link to="{URI_REGISTER}">Register</Link>
    <Link to="{URI_LOGIN}">Login</Link>
    <Link to="{URI_LOGOUT}">Logout</Link>
    <Link to="{URI_RECOVERY}">Recovery</Link>
  </nav>
  <div>
    <PublicRoute path="{URI_REGISTER}" component="{RegisterPage}" />
    <PublicRoute path="{URI_LOGIN}" component="{LoginPage}" />
    <PrivateRoute path="{URI_LOGOUT}" component="{LogoutPage}" />
    <PublicRoute path="{URI_RECOVERY}" component="{RecoveryPage}" />

    <PrivateRoute path="{URI_DEFAULT}" component="{DefaultPage}" />
  </div>
</Router>
