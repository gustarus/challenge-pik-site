<script>
  import ProcessButton from './../../../components/ProcessButton.svelte';

  export let email = '';
  export let password = '';
  export let loading = false;
</script>

<form on:submit>
  <div class="form-group">
    <label for="email">Email address</label>
    <input bind:value={email} type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email here">
    <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
  </div>

  <div class="form-group">
    <label for="password">Password</label>
    <input bind:value={password} type="password" class="form-control" id="password" placeholder="Enter password here">
  </div>

  <ProcessButton loading={loading}>Submit</ProcessButton>
</form>
