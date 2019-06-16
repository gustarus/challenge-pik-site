<script>
  import { logged } from './../stores/logged';
  import auth from './../instances/auth';

  function onSubmit(e) {
    e.preventDefault();
    const username = e.target.elements.username.value;
    const password = e.target.elements.password.value;

    const trigger = (success) => logged.update(() => success);
    auth.login(username, password).then(trigger);
  }
</script>

<style>
	h1 {
		color: purple;
	}
</style>

<h1>Login page</h1>

<form on:submit={onSubmit}>
  <input type="text" name="username" />
  <input type="password" name="password" />
  <button type="submit">Login</button>
</form>
