<script>
  import { logged } from '../../stores/logged';
  import { title } from '../../stores/meta';
  import auth from '../../instances/auth';
  import CredentialsForm from './parial/CredentialsForm.svelte';

  $title = 'Sign in with existed account';

  export let email = '';
  export let password = '';

  let loading = false;
  async function onSubmit(e) {
    e.preventDefault();
    loading = true;
    const trigger = (success) => logged.update(() => success);
    await auth.login(email, password).then(trigger);
    loading = false;
  }
</script>

<CredentialsForm bind:email bind:password on:submit={onSubmit} loading={loading} />
