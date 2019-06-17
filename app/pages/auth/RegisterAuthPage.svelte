<script>
  import auth from '../../instances/auth';
  import { logged } from '../../stores/logged';

  async function onSubmit(e) {
    e.preventDefault();
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;

    // register user
    const registerSuccess = await auth.register(email, password);
    if (!registerSuccess) {
      return;
    }

    // login user
    const loginSuccess = await auth.login(email, password);
    if (!loginSuccess) {
      return;
    }

    // update store
    logged.update(() => true)
  }
</script>

<style>
	h1 {
		color: purple;
	}
</style>

<h1>Register page</h1>

<form on:submit={onSubmit}>
  Email
  <input type="text" name="email" />

  Password
  <input type="password" name="password" />

  <button type="submit">Register</button>
</form>
