<script>
  import { Router, Link, Route } from 'svelte-routing';
  import PrivateRoute from './components/PrivateRoute';
  import PublicRoute from './components/PublicRoute';
  import InstallPrompt from './components/InstallPrompt.svelte';
  import ServiceWorker from './components/ServiceWorker.svelte';
  import DefaultHomePage from './pages/home/DefaultHomePage';
  import RegisterAuthPage from './pages/auth/RegisterAuthPage';
  import LoginAuthPage from './pages/auth/LoginAuthPage';
  import LogoutAuthPage from './pages/auth/LogoutAuthPage';
  import PropertyIndexPage from './pages/property/PropertyIndexPage.svelte';
  import PropertyCreatePage from './pages/property/PropertyCreatePage.svelte';
  import PropertyUpdatePage from './pages/property/PropertyUpdatePage.svelte';
  import PropertyDeletePage from './pages/property/PropertyDeletePage.svelte';
  import PropertyViewPage from './pages/property/PropertyViewPage.svelte';
  import RoomIndexPage from './pages/room/RoomIndexPage.svelte';
  import RoomCreatePage from './pages/room/RoomCreatePage.svelte';
  import RoomUpdatePage from './pages/room/RoomUpdatePage.svelte';
  import RoomDeletePage from './pages/room/RoomDeletePage.svelte';
  import RoomViewPage from './pages/room/RoomViewPage.svelte';
  import Navigation from './partials/Navigation.svelte';
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
    URI_ROOM_VIEW,
    URI_ROOM_INDEX,
    URI_ROOM_CREATE,
    URI_ROOM_UPDATE,
    URI_ROOM_DELETE,
  } from './constants';

  export let url = '';
</script>

<Router url={url}>
  <ServiceWorker />
  <InstallPrompt />
  <Navigation />

  <div>
    <PublicRoute path={URI_REGISTER} component={RegisterAuthPage} />
    <PublicRoute path={URI_LOGIN} component={LoginAuthPage} />
    <PrivateRoute path={URI_LOGOUT} component={LogoutAuthPage} />

    <PrivateRoute path={URI_PROPERTY_INDEX} component={PropertyIndexPage} />
    <PrivateRoute path={URI_PROPERTY_CREATE} component={PropertyCreatePage} />
    <PrivateRoute path={URI_PROPERTY_UPDATE} component={PropertyUpdatePage} />
    <PrivateRoute path={URI_PROPERTY_VIEW} component={PropertyViewPage} />
    <PrivateRoute path={URI_PROPERTY_DELETE} component={PropertyDeletePage} />

    <PrivateRoute path={URI_ROOM_INDEX} component={RoomIndexPage} />
    <PrivateRoute path={URI_ROOM_CREATE} component={RoomCreatePage} />
    <PrivateRoute path={URI_ROOM_UPDATE} component={RoomUpdatePage} />
    <PrivateRoute path={URI_ROOM_VIEW} component={RoomViewPage} />
    <PrivateRoute path={URI_ROOM_DELETE} component={RoomDeletePage} />

    <PrivateRoute path={URI_DEFAULT} component={DefaultHomePage} />
  </div>
</Router>

<style global>
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section {
    display: block;
  }
  body {
    line-height: 1;
  }
  ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  input, select, textarea {
    margin: 0;
    padding: 0;
  }
</style>
