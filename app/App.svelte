<script>
  import { Router, Link, Route } from 'svelte-routing';
  import PrivateRoute from './components/PrivateRoute';
  import PublicRoute from './components/PublicRoute';
  import DefaultHomePage from './pages/home/DefaultHomePage';
  import RegisterAuthPage from './pages/auth/RegisterAuthPage';
  import LoginAuthPage from './pages/auth/LoginAuthPage';
  import LogoutAuthPage from './pages/auth/LogoutAuthPage';
  import PropertyIndexPage from './pages/property/PropertyIndexPage.svelte';
  import PropertyCreatePage from './pages/property/PropertyCreatePage.svelte';
  import PropertyUpdatePage from './pages/property/PropertyUpdatePage.svelte';
  import PropertyDeletePage from './pages/property/PropertyDeletePage.svelte';
  import PropertyViewPage from './pages/property/PropertyViewPage.svelte';
  import {
    URI_DEFAULT,
    URI_REGISTER,
    URI_LOGIN,
    URI_LOGOUT,
    URI_PROPERTY_VIEW,
    URI_PROPERTY_INDEX,
    URI_PROPERTY_CREATE,
    URI_PROPERTY_UPDATE,
    URI_PROPERTY_DELETE,
  } from './constants';

  export let url = '';
</script>

<Router url={url}>
  <nav>
    <Link to={URI_DEFAULT}>Default</Link>
    <Link to={URI_REGISTER}>Register</Link>
    <Link to={URI_LOGIN}>Login</Link>
    <Link to={URI_LOGOUT}>Logout</Link>
  </nav>
  <div>
    <PublicRoute path={URI_REGISTER} component={RegisterAuthPage} />
    <PublicRoute path={URI_LOGIN} component={LoginAuthPage} />
    <PrivateRoute path={URI_LOGOUT} component={LogoutAuthPage} />

    <PrivateRoute path={URI_PROPERTY_INDEX} component={PropertyIndexPage} />
    <PrivateRoute path={URI_PROPERTY_CREATE} component={PropertyCreatePage} />
    <PrivateRoute path={URI_PROPERTY_UPDATE} component={PropertyUpdatePage} />
    <PrivateRoute path={URI_PROPERTY_VIEW} component={PropertyViewPage} />
    <PrivateRoute path={URI_PROPERTY_DELETE} component={PropertyDeletePage} />

    <PrivateRoute path={URI_DEFAULT} component={DefaultHomePage} />
  </div>
</Router>
