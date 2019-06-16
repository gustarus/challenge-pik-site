<script>
  import { Router, Link, Route } from 'svelte-routing';

  import RegisterPage from './pages/RegisterPage';
  import LoginPage from './pages/LoginPage';
  import RecoveryPage from './pages/RecoveryPage';

  export let url = "";
</script>

<Router url="{url}">
  <nav>
    <Link to="/register">Register</Link>
    <Link to="/login">Login</Link>
    <Link to="/recovery">Recovery</Link>
  </nav>
  <div>
    <Route path="register" component="{RegisterPage}" />
    <Route path="login" component="{LoginPage}" />
    <Route path="recovery" component="{RecoveryPage}" />

    <Route path="/" component="{LoginPage}" />
  </div>
</Router>
