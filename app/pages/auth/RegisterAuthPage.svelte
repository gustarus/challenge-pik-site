<script>
  import auth from '../../instances/auth';
  import { logged } from '../../stores/logged';
  import { title } from './../../stores/meta';
  import CredentialsForm from './parial/CredentialsForm.svelte';

  export let email = '';
  export let password = '';

  $title = 'Sign up as new user';

  let loading = false;
  async function onSuccess() {
    loading = true;

    const registerSuccess = await auth.register(email, password);
    if (!registerSuccess) {
      loading = false;
      return;
    }

    const loginSuccess = await auth.login(email, password);
    if (!loginSuccess) {
      loading = false;
      return;
    }

    logged.update(() => true);
    loading = false;
  }
</script>

<CredentialsForm bind:email bind:password on:success={onSuccess} loading={loading} />
