<script>
  import { logged } from '../../stores/logged';
  import auth from '../../instances/auth';

  const trigger = () => logged.update(() => false);
  auth.logout().then(trigger);
</script>

<style>
	h1 {
		color: purple;
	}
</style>

<h1>Logout page</h1>
