<script>
  import { logged } from '../../stores/logged';
  import auth from '../../instances/auth';

  function onSubmit(e) {
    e.preventDefault();
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;

    const trigger = (success) => logged.update(() => success);
    auth.login(email, password).then(trigger);
  }
</script>

<style>
	h1 {
		color: purple;
	}
</style>

<h1>Login page</h1>

<form on:submit={onSubmit}>
  Email
  <input type="text" name="email" />

  Password
  <input type="password" name="password" />

  <button type="submit">Login</button>
</form>
