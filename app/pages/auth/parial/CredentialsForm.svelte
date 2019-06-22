<script>
  import { createEventDispatcher } from 'svelte';
  import ProcessButton from './../../../components/ProcessButton.svelte';

  export let email = '';
  export let password = '';
  export let loading = false;


  const dispatch = createEventDispatcher();

  async function onSubmit(e) {
    e.preventDefault();
    if (e.target.checkValidity() === false) {
      e.target.classList.add('was-validated');
      dispatch('error', { target: e.target });
      return;
    }

    dispatch('success', { target: e.target });
  }
</script>

<form on:submit={onSubmit} class="needs-validation" novalidate>
  <div class="form-group">
    <label for="email">Email address <sup class="text-danger">*</sup></label>
    <input bind:value={email} type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email here" required>
    <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
    <div class="invalid-feedback">
      Please enter username.
    </div>
  </div>

  <div class="form-group">
    <label for="password">Password <sup class="text-danger">*</sup></label>
    <input bind:value={password} type="password" class="form-control" id="password" placeholder="Enter password here" required>
    <div class="invalid-feedback">
      Please enter password.
    </div>
  </div>

  <ProcessButton loading={loading}>Submit</ProcessButton>
</form>
